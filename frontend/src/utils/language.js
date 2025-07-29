// Language utility functions
export const getLanguageName = (code) => {
  switch (code) {
    case "sinhala":
      return "සිංහල";
    case "tamil":
      return "தமிழ்";
    case "english":
      return "English";
    default:
      return "සිංහල"; // Default to Sinhala
  }
};

export const getLanguageCode = (name) => {
  switch (name) {
    case "සිංහල":
      return "sinhala";
    case "தமிழ்":
      return "tamil";
    case "English":
      return "english";
    default:
      return "sinhala"; // Default to Sinhala
  }
};

// Initialize language settings
export const initLanguage = () => {
  const savedLanguage = localStorage.getItem("language") || "sinhala";
  document.documentElement.lang = savedLanguage;
  return savedLanguage;
};

export const setLanguage = (languageCode) => {
  localStorage.setItem("language", languageCode);
  document.documentElement.lang = languageCode;
  window.location.reload(); // Refresh to apply language changes
};

// Translation dictionary (simplified example)
const translations = {
  welcome: {
    sinhala: "සාදරයෙන් පිළිගනිමු",
    tamil: "வரவேற்பு",
    english: "Welcome",
  },
  // Add more translations as needed
};

export const translate = (key, language) => {
  return translations[key]?.[language] || key;
};
