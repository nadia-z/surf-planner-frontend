import React from "react";
import {useDrag} from "react-dnd";
import {ItemTypes} from "../../constants/ItemTypes";
import Person from "../person/Person";
import "./student.css";


const Student = ({student, removeStudent, highlightBookingNumber, setHighlightBookingNumber}) => {
    const [{isDragging}, drag] = useDrag(() => ({
        type: ItemTypes.STUDENT,
        item: () => ({student: {...student}}), // Ensure fresh snapshot of student
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
        ><span>{student.single_parent ? "🙍‍♀️" :""}</span>
            <Person
                name={`${student.first_name} ${student.last_name}`}
                level={student.level}
                number_of_surf_lessons={student.number_of_surf_lessons}
                birthday={student.birthday}
                title={`id:\t\t${student.id}\nfirst name:\t\t${student.first_name}\nlast name:\t\t${student.last_name}\ngender:\t\t${student.gender}\nbirthday:\t\t${student.birthday}\nage group:\t\t${student.age_group}\nlevel:\t\t${student.level}\nbooking number:\t\t${student.booking_number}\narrival date:\t\t${student.arrival}\ndeparture date:\t\t${student.departure}\nbooking status:\t\t${student.booking_status}\nnumber of surflessons:\t\t${student.number_of_surf_lessons}\npackage:\t\t${student.surf_lesson_package_name}\ntent:\t\t${student.tent}\nsingle parent:\t\t${student.single_parent}
                `}
                showButton={true}
                onRemove={() => removeStudent(student)}
            />
        </li>
    );
};

export default Student;
