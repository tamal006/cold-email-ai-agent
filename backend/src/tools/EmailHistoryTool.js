import { Email } from "../models/Email.js";
export class EmailHistoryTool {
  async saveEmail(data) {
    const email = await Email.create(data);
    return email;
  }
  async updateEmail(id, data) {
    const email = await Email.findByIdAndUpdate(id, data, { new: true });
    return email;
  }
  async getEmails(userId, filters = {}) {
    const { status, search, page = 1, limit = 10 } = filters;
    const query = { userId };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { recipientEmail: { $regex: search, $options: "i" } },
        { recipientName: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } }
      ];
    }
    const [emails, total] = await Promise.all([
      Email.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Email.countDocuments(query)
    ]);
    return { emails, total };
  }
  async getEmailById(id, userId) {
    return Email.findOne({ _id: id, userId });
  }
  async deleteEmail(id, userId) {
    const result = await Email.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
  async getStats(userId) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const [totalSent, todayEmails, totalFailed, totalDrafts] = await Promise.all([
      Email.countDocuments({ userId, status: "sent" }),
      Email.countDocuments({ userId, status: "sent", sentAt: { $gte: today } }),
      Email.countDocuments({ userId, status: "failed" }),
      Email.countDocuments({ userId, status: "draft" })
    ]);
    const total = totalSent + totalFailed;
    const successRate = total > 0 ? Math.round(totalSent / total * 100) : 100;
    return {
      totalSent,
      todayEmails,
      successRate,
      totalDrafts
    };
  }
  async getWeeklyActivity(userId) {
    const sevenDaysAgo = /* @__PURE__ */ new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const result = await Email.aggregate([
      {
        $match: {
          userId: { $eq: userId },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const activity = [];
    for (let i = 6; i >= 0; i--) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const found = result.find((r) => r._id === dateStr);
      activity.push({ date: dateStr, count: found ? found.count : 0 });
    }
    return activity;
  }
}
