// src/components/admin/PlatformAnalytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PlatformAnalytics = () => {
  const [stats, setStats] = useState({
    users: 0,
    lessons: 0,
    downloads: 0,
    questions: 0,
    answers: 0,
  });

  useEffect(() => {
    axios
      .get("/api/admin/stats") // Replace with your backend endpoint
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>
      <ul className="space-y-2">
        <li>👤 Users: {stats.users}</li>
        <li>📚 Lessons: {stats.lessons}</li>
        <li>⬇️ Downloads: {stats.downloads}</li>
        <li>❓ Questions: {stats.questions}</li>
        <li>💬 Answers: {stats.answers}</li>
      </ul>
    </div>
  );
};

export default PlatformAnalytics;
