// src/components/student/Student.jsx
import React from "react";
import Person from "../person/Person"; // adjust path as needed
import "./guest.css";

const Guest = ({student, onClick}) => (
<li onClick={() => onClick(student)} className="guest">
  <Person
    name={`${student.first_name} ${student.last_name}`}
  />
</li>
);

export default Guest;
// when guest from guest list clicked
// i want to to call addStudentToGroup and pass it the student.id
//
