// src/components/person/Person.jsx
import React from "react";
import "./person.css";

function getAge(birthday) {

    var ageDifMs = Date.now() - new Date(birthday).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const Person = ({name, level, birthday, number_of_surf_lessons, title, showButton, onRemove}) => (
    <div className="student-container" title={title}>
        <span><b>{name}</b></span>
        <span className="level">{level}</span>
        <span className="birthday">{getAge(birthday)}</span>
        {showButton && (
            <button onClick={onRemove} className="remove-button">×</button>
        )}
    </div>
);

export default Person;
