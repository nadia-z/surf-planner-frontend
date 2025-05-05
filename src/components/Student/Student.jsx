import React from "react";
import "./student.css";

const Student = ({ student, removeStudent }) => (
    <li key={student.student_id}>{student.first_name} {student.last_name}
    <button onClick={() => removeStudent(student.student_id)}>X</button></li>
  );


export default Student;
