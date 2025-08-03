import React, { useEffect, useState } from "react";
import {
  fetchApprovedLessons,
  incrementLessonView,
  createDownload,
} from "../../services/contentService";
import ContentCard from "./ContentCard";
import { useAuth } from "../../auth/useAuth"; // Assuming custom auth hook

const LessonList = () => {
  const [lessons, setLessons] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchApprovedLessons().then((res) => setLessons(res.data));
  }, []);

  const handleView = (lessonId) => {
    incrementLessonView(lessonId);
  };

  const handleDownload = (lessonId) => {
    createDownload(user.id, lessonId)
      .then(() => alert("Download started or registered!"))
      .catch((err) => alert(err.response?.data?.message || "Error"));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lessons.map((lesson) => (
        <ContentCard
          key={lesson.lessonId}
          lesson={lesson}
          onView={() => handleView(lesson.lessonId)}
          onDownload={() => handleDownload(lesson.lessonId)}
        />
      ))}
    </div>
  );
};

export default LessonList;
