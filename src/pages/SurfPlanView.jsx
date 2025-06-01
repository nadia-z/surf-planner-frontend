import React, { useEffect, useState } from "react";
import { fetchSurfPlan } from "../api/surfPlanApi";
import SurfPlan from "../components/surfPlan/SurfPlan";

function SurfPlanView() {
  const [surfPlanData, setSurfPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

const addStudentToGroup = (studentId, slotIndex, groupIndex) => {
  let addedStudent = null;

  // Remove from guests (if present)
  const updatedGuests = surfPlanData.non_participating_guests.filter(guest => {
    if (guest.student_id === studentId) {
      addedStudent = guest;
      return false;
    }
    return true;
  });

  // Remove from any group (if present)
  const cleanedSlots = surfPlanData.slots.map(slot => ({
    ...slot,
    groups: slot.groups.map(group => ({
      ...group,
      students: group.students.filter(student => {
        if (student.student_id === studentId) {
          addedStudent = student;
          return false;
        }
        return true;
      }),
    })),
  }));

  if (!addedStudent) {
    console.warn("Student not found in guests or any group:", studentId);
    return;
  }

  // Now insert into the correct group, immutably
  const updatedSlots = cleanedSlots.map((slot, sIndex) => ({
    ...slot,
    groups: slot.groups.map((group, gIndex) => {
      if (sIndex === slotIndex && gIndex === groupIndex) {
        return {
          ...group,
          students: [...group.students, addedStudent],
        };
      }
      return group;
    }),
  }));

  setSurfPlan({
    ...surfPlanData,
    non_participating_guests: updatedGuests,
    slots: updatedSlots,
  });
};


  const removeStudent = (studentId) => {
    console.log("Remove student with ID:", studentId);
    let removedStudent = null;

    const updatedPlan = {
      ...surfPlanData,
      slots: surfPlanData.slots.map(slot => ({
        ...slot,
        groups: slot.groups.map(group => ({
          ...group,
          students: group.students.filter(student => {
            if (student.student_id === studentId) {
              removedStudent = student;
              return false;
            }
            return true;
          })
        }))
      })),
      non_participating_guests: [
        ...surfPlanData.non_participating_guests,
        ...(removedStudent ? [removedStudent] : [])
      ]
    };
    setSurfPlan(updatedPlan);
    console.log("check Remove Student", updatedPlan)
  };

  return (
    <div>
      {loading ? (
        <p>Loading... 🎉</p>
      ) : (
        surfPlanData ? <SurfPlan plan={surfPlanData} removeStudent={removeStudent} addStudentToGroup={addStudentToGroup}/> : <p>No surf plan available.</p>
      )}

    </div>
  );
}

export default SurfPlanView;
