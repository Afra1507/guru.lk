const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Simulated user data - replace with actual API calls
const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@guru.lk",
    role: "admin",
    preferredLanguage: "sinhala",
    region: "Colombo",
    isLowIncome: false,
    joinDate: "2023-01-01",
    lastLogin: new Date().toISOString(),
    stats: {
      lessonsUploaded: 0,
      lessonsDownloaded: 0,
      questionsAsked: 0,
      answersProvided: 0,
      likesReceived: 0,
      reputationScore: 0,
    },
  },
  // Add more test users as needed
];

export const login = async (email, password) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      if (user && password === "password") {
        // Simple mock validation
        resolve({
          success: true,
          user,
          token: "mock-jwt-token",
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
};

export const register = async (userData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        ...userData,
        id: users.length + 1,
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        stats: {
          lessonsUploaded: 0,
          lessonsDownloaded: 0,
          questionsAsked: 0,
          answersProvided: 0,
          likesReceived: 0,
          reputationScore: 0,
        },
      };
      users.push(newUser);
      resolve({
        success: true,
        user: newUser,
        token: "mock-jwt-token",
      });
    }, 1000);
  });
};

export const getProfile = async () => {
  // Simulate API call - in a real app, this would use the authenticated user's token
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users[0]); // Return the first user as mock profile
    }, 800);
  });
};

export const updateProfile = async (updatedData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedUser = { ...users[0], ...updatedData };
      users[0] = updatedUser;
      resolve(updatedUser);
    }, 800);
  });
};
