import { Job } from "../models/Job.js";
import { Company } from "../models/Company.js";
import { Contact } from "../models/Contact.js";
import { CompanyResearchAgent } from "../agents/CompanyResearchAgent.js";
import { ContactDiscoveryAgent } from "../agents/ContactDiscoveryAgent.js";
import { ContactRankingAgent } from "../agents/ContactRankingAgent.js";
const companyResearchAgent = new CompanyResearchAgent();
const contactDiscoveryAgent = new ContactDiscoveryAgent();
const contactRankingAgent = new ContactRankingAgent();
export const discoverContacts = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) {
      res.status(404).json({ message: "Job not found." });
      return;
    }
    let company = await Company.findOne({ userId, name: { $regex: new RegExp(`^${job.company}$`, "i") } });
    if (!company) {
      const companyInsight = await companyResearchAgent.research(job.company, job.title);
      company = await Company.create({
        userId,
        name: job.company,
        website: companyInsight.website,
        industry: companyInsight.industry,
        products: companyInsight.products,
        services: companyInsight.services,
        companySize: companyInsight.companySize,
        recentNews: companyInsight.recentNews,
        techStack: companyInsight.techStack,
        hiringActivity: companyInsight.hiringActivity,
        culture: companyInsight.culture,
        mission: companyInsight.mission,
        insightSummary: companyInsight.insightSummary,
        researchedAt: /* @__PURE__ */ new Date()
      });
    }
    let contacts = await Contact.find({ userId, jobId });
    if (contacts.length === 0) {
      const discovered = await contactDiscoveryAgent.discover(job.company, job.title, company.website);
      const ranked = await contactRankingAgent.rank(discovered, job.title, job.skills, job.company);
      const contactPromises = ranked.map((c) => {
        return Contact.create({
          userId,
          jobId: job._id,
          companyId: company?._id,
          fullName: c.fullName,
          role: c.role,
          department: c.department,
          profileUrl: c.profileUrl,
          sourceUrl: c.sourceUrl,
          email: c.email,
          emailStatus: c.emailStatus,
          confidenceScore: c.confidenceScore,
          relevanceScore: c.relevanceScore,
          isSuggested: c.isSuggested,
          saved: false
        });
      });
      contacts = await Promise.all(contactPromises);
      job.status = "contacts_found";
      await job.save();
    }
    res.json({
      message: "Contacts discovered successfully",
      company,
      contacts
    });
  } catch (error) {
    console.error("Discover contacts error:", error);
    res.status(500).json({ message: error.message || "Failed to discover contacts." });
  }
};
export const getContactsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;
    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) {
      res.status(404).json({ message: "Job not found." });
      return;
    }
    const company = await Company.findOne({ userId, name: { $regex: new RegExp(`^${job.company}$`, "i") } });
    const contacts = await Contact.find({ userId, jobId }).sort({ relevanceScore: -1 });
    res.json({
      company,
      contacts
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ message: "Failed to fetch contacts." });
  }
};
export const toggleSaveContact = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const contact = await Contact.findOne({ _id: id, userId });
    if (!contact) {
      res.status(404).json({ message: "Contact not found." });
      return;
    }
    contact.saved = !contact.saved;
    await contact.save();
    res.json({
      message: contact.saved ? "Contact saved successfully" : "Contact removed from saved list",
      contact
    });
  } catch (error) {
    console.error("Save contact error:", error);
    res.status(500).json({ message: "Failed to toggle contact saved status." });
  }
};
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const deleted = await Contact.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      res.status(404).json({ message: "Contact not found or unauthorized." });
      return;
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({ message: "Failed to delete contact." });
  }
};
