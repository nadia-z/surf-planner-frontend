import React, {useEffect, useState} from "react";
import {fetchSurfPlan} from "../api/surfPlanApi";
import SurfPlan from "../components/surfPlan/SurfPlan";
import {produce} from 'immer';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


function getAge(birthday) {

    var ageDifMs = Date.now() - new Date(birthday).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function generateExcelFromPlan(plan) {
    const rows = [];

    plan.slots.forEach((slot, slotIndex) => {
        rows.push([`Slot ${slot.time || String.fromCharCode(65 + slotIndex)}`]);

        slot.groups.forEach(group => {
            const levelLabel = group.level?.charAt(0).toUpperCase() + group.level?.slice(1);
            rows.push([levelLabel]);

            group.students.forEach(student => {
                rows.push([`- ${student.first_name} ${student.last_name} ${getAge(student.birthday)}`]);
            });

            rows.push([""]); // empty row after group
        });

        rows.push([""]); // empty row after slot
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Surf Groups");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "surf_group_plan.xlsx");
}



function SurfPlanView() {
    const [surfPlanData, setSurfPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [highlightBookingNumber, setHighlightBookingNumber] = useState(null);
    const [pickedDate, setPickedDate] = useState(new Date().toISOString().slice(0, 10));


    useEffect(() => {
        console.log("fetching surf plan from server ...")
        fetchSurfPlan(pickedDate)
            .then((data) => {
                setSurfPlan(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [pickedDate]);


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
    const pickNewDate = (date) => {
        setPickedDate(date)
    }

    return (
        <div>
            {loading ? (
                <p>Loading... 🎉</p>
            ) : (


                surfPlanData ? <div>
                    <button className="btn btn-primary btn-sm mb-2" onClick={() => generateExcelFromPlan(surfPlanData)}>
                        Download Excel
                    </button>
                    <SurfPlan
                        plan={surfPlanData}
                        selectedDate={pickedDate}
                        setSelectedDate={pickNewDate}
                        removeStudent={removeStudent}
                        addStudentToGroup={addStudentToGroup}
                        highlightBookingNumber={highlightBookingNumber}
                        setHighlightBookingNumber={setHighlightBookingNumber}
                    /></div> : <p>No surf plan available.</p>
            )}

        </div>
    );
}

export default SurfPlanView;
