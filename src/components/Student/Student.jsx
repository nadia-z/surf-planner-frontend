import React from "react";
import "./student.css";

const Student = ({ student }) => (
    <li key={student.student_id}>{student.first_name} {student.last_name}</li>
  );


export default Student;
