import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaGlobe } from "react-icons/fa";
import { getLanguageName } from "../../utils/language";

const LanguageSelector = ({ selectedLanguage, onChange }) => {
  const languages = [
    { code: "sinhala", name: "සිංහල" },
    { code: "tamil", name: "தமிழ்" },
    { code: "english", name: "English" },
  ];

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-light" id="dropdown-language">
        <FaGlobe className="me-1" />
        {getLanguageName(selectedLanguage)}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {languages.map((language) => (
          <Dropdown.Item
            key={language.code}
            active={selectedLanguage === language.code}
            onClick={() => {
              onChange(language.code);
              window.location.reload();
            }}
          >
            {language.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSelector;
