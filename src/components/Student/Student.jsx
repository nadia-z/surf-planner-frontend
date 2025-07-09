import React from "react";
import {useDrag} from "react-dnd";
import {ItemTypes} from "../../constants/ItemTypes";
import Person from "../person/Person";
import "./student.css";


const Student = ({student, removeStudent, highlightBookingNumber, setHighlightBookingNumber}) => {
    const [{isDragging}, drag] = useDrag(() => ({
        type: ItemTypes.STUDENT,
        item: () => ({ student: { ...student } }), // Ensure fresh snapshot of student
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    const isHighlighted = highlightBookingNumber && student.booking_number === highlightBookingNumber;

    return (
        <li
            className={`student-container ${isHighlighted ? 'highlighted' : ''}`}
            ref={drag}
            style={{opacity: isDragging ? 0.5 : 1}}
            aria-label={`${student.first_name} ${student.last_name} student`}
            onClick={() => setHighlightBookingNumber(student.booking_number)}
        >
            <Person
                name={`${student.first_name} ${student.last_name}`}
                showButton={true}
                onRemove={() => removeStudent(student)}
            />
        </li>
    );
};

export default Student;
