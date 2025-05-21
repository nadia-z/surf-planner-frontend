// src/components/person/Person.jsx
import React from "react";
import "./person.css";

const Person = ({ name, level, showButton, onRemove }) => (
  <div className="student-container">
    <span>
      {name}
      {level && <span> – Level {level}</span>}
    </span>
    {showButton && (
      <button onClick={onRemove} className="remove-button">×</button>
    )}
  </div>
);

export default Person;
