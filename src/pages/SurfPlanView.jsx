import React, {useEffect, useState} from "react";
import {fetchSurfPlan} from "../api/surfPlanApi";
import SurfPlan from "../components/surfPlan/SurfPlan";
import { produce } from 'immer';


function SurfPlanView() {
    const [surfPlanData, setSurfPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [highlightBookingNumber, setHighlightBookingNumber] = useState(null);


    useEffect(() => {
        console.log("fetching surf plan from server ...")
        fetchSurfPlan()
            .then((data) => {
                setSurfPlan(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);


    const addStudentToGroup = (student, destinationGroup) => {
        setSurfPlan(currentPlan =>
            produce(currentPlan, draft => {
                // Remove from guests
                draft.non_participating_guests = draft.non_participating_guests.filter(guest => guest.id !== student.id);

                // Remove from all groups
                for (const slot of draft.slots) {
                    for (const group of slot.groups) {
                        group.students = group.students.filter(s => s.id !== student.id);
                    }
                }

                // Add to destination group
                for (const slot of draft.slots) {
                    for (const group of slot.groups) {
                        if (group.level === destinationGroup.level) {
                            group.students.push(student);
                            return; // Stop after placing the student
                        }
                    }
                }
            })
        );
    };


    const removeStudent = (student) => {
        setSurfPlan(currentPlan =>
            produce(currentPlan, draft => {
                for (const slot of draft.slots) {
                    for (const group of slot.groups) {
                        group.students = group.students.filter(s => s.id !== student.id);
                    }
                }

                const alreadyInGuests = draft.non_participating_guests.some(g => g.id === student.id);
                if (!alreadyInGuests) {
                    draft.non_participating_guests.push(student);
                }
            })
        );
    };




    return (
        <div>
            {loading ? (
                <p>Loading... 🎉</p>
            ) : (
                surfPlanData ? <SurfPlan
                    plan={surfPlanData}
                    removeStudent={removeStudent}
                    addStudentToGroup={addStudentToGroup}
                    highlightBookingNumber={highlightBookingNumber}
                    setHighlightBookingNumber={setHighlightBookingNumber}
                /> : <p>No surf plan available.</p>
            )}

        </div>
    );
}

export default SurfPlanView;
