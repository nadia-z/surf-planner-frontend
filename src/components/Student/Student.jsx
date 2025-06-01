import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../constants/ItemTypes";
import Person from "../person/Person";
import "./student.css";


const Student = ({ student, removeStudent }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.STUDENT,
    item: { student },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li
      className="student"
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      aria-label={`${student.first_name} ${student.last_name} student`}
    >
      <Person
        name={`${student.first_name} ${student.last_name}`}
        showButton={true}
        onRemove={() => removeStudent(student.student_id)}
      />
    </li>
  );
};

export default Student;
