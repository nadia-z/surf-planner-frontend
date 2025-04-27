import React from "react";
import "./students.css";
import Student from "../Student/Student"

const Students = ({ students }) => (
  <ul>
    {students.map((student) => (
      <Student key={student.student_id} student={student} />
    ))}
  </ul>
);

export default Students;
