import React, { useEffect, useState } from "react";
import { getUserDownloads } from "../../services/contentService";
import { useAuth } from "../../auth/useAuth";

const UserDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getUserDownloads(user.id).then((res) => setDownloads(res.data));
  }, []);

  return (
    <div>
      <h2>Your Downloads</h2>
      <ul>
        {downloads.map((dl) => (
          <li key={dl.downloadId}>
            {dl.lesson.title} — Expires:{" "}
            {new Date(dl.expiresAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDownloads;
