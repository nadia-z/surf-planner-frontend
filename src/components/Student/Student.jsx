import React from "react";
import "./student.css";

const Student = ({ student, removeStudent }) => (
<li className="student-container">
  <span>{student.first_name} {student.last_name}</span>
  <button onClick={() => removeStudent(student.student_id)}>×</button>
</li>
  );


export default Student;
