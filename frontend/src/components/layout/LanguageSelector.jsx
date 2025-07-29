import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaGlobe } from "react-icons/fa";

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("sinhala");

  const languages = [
    { code: "sinhala", name: "සිංහල" },
    { code: "tamil", name: "தமிழ்" },
    { code: "english", name: "English" },
  ];

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    // TODO: Implement language change logic (context/API)
    console.log("Language changed to:", langCode);
  };

  const currentLanguage = languages.find(
    (lang) => lang.code === selectedLanguage
  );

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-light" id="dropdown-language">
        <FaGlobe className="me-1" />
        {currentLanguage?.name || "සිංහල"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {languages.map((language) => (
          <Dropdown.Item
            key={language.code}
            active={selectedLanguage === language.code}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSelector;
