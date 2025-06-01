import React, { useEffect, useState } from "react";
import "./surfPlan.css";
import Slot from "../slot/slot";
import DatePicker from "../datepicker/DatePicker";
import {fetchSurfPlan} from "../../api/surfPlanApi"; // adjust path as needed

const SurfPlan = ({removeStudent, addStudentToGroup}) => {
    const [selectedDate, setSelectedDate] = useState("2025-06-01");
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        const loadPlan = async () => {
            try {
                const data = await fetchSurfPlan(selectedDate);
                setPlan(data);
            } catch (err) {
                setPlan(null);
            }
        };
        loadPlan();
    }, [selectedDate]);

    return (
        <div className="surfplan-container">
            <div className="surfplan-header">
                <h2>Surf Plan for {selectedDate}</h2>
                <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            </div>

            {plan ? (
                plan.slots.map((slot, slotIndex) => (
                    <Slot
                        key={slotIndex}
                        slot={slot}
                        slotIndex={slotIndex}
                        removeStudent={removeStudent}
                        addStudentToGroup={addStudentToGroup}
                        non_participating_guests={plan.non_participating_guests}
                    />
                ))
            ) : (
                <p>Loading surf plan...</p>
            )}
        </div>
    );

};

export default SurfPlan;
