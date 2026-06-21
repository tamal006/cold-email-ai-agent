import { useState, useCallback } from "react";
import { emailService } from "@/services/emailService";
export function useEmails() {
  const [emails, setEmails] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchEmails = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await emailService.getEmails(params);
      setEmails(data.emails);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch emails");
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteEmail = useCallback(async (id) => {
    try {
      await emailService.deleteEmail(id);
      setEmails((prev) => prev.filter((e) => e._id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete email");
      throw err;
    }
  }, []);
  return { emails, total, totalPages, loading, error, fetchEmails, deleteEmail };
}
export function useEmailStats() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await emailService.getStats();
      setStats(data.stats);
      setActivity(data.activity);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  return { stats, activity, loading, fetchStats };
}
