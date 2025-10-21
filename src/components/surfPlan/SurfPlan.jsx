import Slot from "../slot/slot";
import DatePicker from "../datepicker/DatePicker";

const SurfPlan = ({
                      plan,
                      selectedDate,
                      setSelectedDate,
                      removeStudent,
                      addStudentToGroup,
                      highlightBookingNumber,
                      setHighlightBookingNumber
                  }) => {
    return (
        <div className="surfplan-container">

            <div className="surfplan-header">
                <h2>Surf Plan for {selectedDate}</h2>
                <DatePicker selectedDate={selectedDate} onChange={setSelectedDate}/>
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
                        highlightBookingNumber={highlightBookingNumber}
                        setHighlightBookingNumber={setHighlightBookingNumber}
                    />
                ))
            ) : (
                <p>Loading surf plan...</p>
            )}
        </div>
    );
};

export default SurfPlan;
