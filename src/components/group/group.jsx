import React, {useState, useRef, useEffect} from "react";
import {useDrop} from "react-dnd";
import {ItemTypes} from "../../constants/ItemTypes";
import Student from "../Student/Student";
import NonParticipatingGuests from "../NonParticipatingGuests/NonParticipatingGuests";
import "./group.css";

const Group = ({
                   group,
                   removeStudent,
                   non_participating_guests = [],
                   addStudentToGroup,
                   slotIndex,
                   groupIndex, highlightBookingNumber, setHighlightBookingNumber
               }) => {
    const [showGuests, setShowGuests] = useState(false);
    const guestsRef = useRef(null);

    // Drag and drop setup
    const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.STUDENT,
        drop: (item) => {
            console.log("item");
            console.log(item);
            const student = { ...item.student }; // ensure clean copy
            removeStudent(student);
            addStudentToGroup(student, group);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Close guest list if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (guestsRef.current && !guestsRef.current.contains(event.target)) {
                setShowGuests(false);
            }
        };

        if (showGuests) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showGuests]);


    const handleAddGuest = (guest, destinationGroup) => {
        addStudentToGroup(guest, destinationGroup);
    };


    return (
        <div className="groups-item" ref={drop} style={{
            backgroundColor: isOver ? "#e0f7fa" : "white",
            minWidth: "180px",
            maxWidth: "180px",
            flex: "0 0 auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "4px",
            fontSize: "0.75rem"
        }}>
            <p>
                {group.level} <b>{group.students.length}</b>
            </p>
            <ul aria-label={`${group.level} – ${group.age_group} – ${slotIndex}`}>
                {group.students.map((student) => (
                    <Student key={student.id}
                             student={student}
                             removeStudent={removeStudent}
                             highlightBookingNumber={highlightBookingNumber}
                             setHighlightBookingNumber={setHighlightBookingNumber}/>
                ))}
            </ul>
            <button id="btn-participants" onClick={() => setShowGuests(true)}>
                + add students
            </button>
            {showGuests && (
                <div ref={guestsRef}>
                    <NonParticipatingGuests
                        non_participating_guests={non_participating_guests}
                        onAddGuest={handleAddGuest}
                        group={group}
                    />
                </div>
            )}
            <div className="instructor-circle">
                <p className="instructor-label">LL</p>
            </div>
        </div>
    );
};

export default Group;
