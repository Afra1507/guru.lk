// Mock data - replace with actual API calls
const lessons = [
  {
    id: 1,
    title: "Basic Sinhala Grammar",
    description: "Introduction to Sinhala sentence structure",
    content: "Full lesson content about Sinhala grammar...",
    contentType: "video",
    fileUrl: "https://example.com/lesson1.mp4",
    subject: "Language",
    language: "sinhala",
    ageGroup: "All Ages",
    uploader: "John Doe",
    uploadDate: "2023-05-15",
    likes: 24,
    downloads: 56,
    isDownloadable: true,
  },
  // Add more lessons as needed
];

export const getLessons = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(lessons);
    }, 800);
  });
};

export const getLessonById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lesson = lessons.find((l) => l.id === parseInt(id));
      resolve(lesson || null);
    }, 800);
  });
};

export const featuredLessons = [
  lessons[0],
  {
    id: 2,
    title: "Mathematics for Grade 10",
    description: "Algebra basics in Tamil",
    contentType: "text",
    subject: "Mathematics",
    language: "tamil",
    ageGroup: "15-17",
    uploader: "Math Teacher",
    uploadDate: "2023-05-10",
    likes: 15,
    downloads: 42,
    isDownloadable: true,
  },
];

export const uploadLesson = async (lessonData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLesson = {
        ...lessonData,
        id: lessons.length + 1,
        uploader: "Current User",
        uploadDate: new Date().toISOString(),
        likes: 0,
        downloads: 0,
        isDownloadable: true,
      };
      lessons.push(newLesson);
      resolve(newLesson);
    }, 1000);
  });
};

export const downloadLesson = async (lessonId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (lesson) {
        lesson.downloads += 1;
      }
      resolve(lesson);
    }, 500);
  });
};
