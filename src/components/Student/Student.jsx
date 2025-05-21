// src/components/student/Student.jsx
import React from "react";
import Person from "../person/Person";
import "./student.css";

const Student = ({ student, removeStudent }) => (
 <li className="student">
  <Person
    name={`${student.first_name} ${student.last_name}`}
    // level={student.level}
    showButton={true}
    onRemove={() => removeStudent(student.student_id)}
  />
  </li>
);

export default Student;
