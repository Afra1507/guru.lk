import React, { createContext, useState, useEffect } from "react";
import {
  initLanguage,
  setLanguage as persistLanguage,
} from "../utils/language";

export const LanguageContext = createContext({
  language: "sinhala",
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [language, setLang] = useState(initLanguage());

  const changeLanguage = (langCode) => {
    persistLanguage(langCode); // Save to localStorage and update <html> lang
    setLang(langCode); // Update React state to re-render components
  };

  useEffect(() => {
    // Sync html lang attribute on mount and when language changes
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
