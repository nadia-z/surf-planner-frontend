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

  const updatedPlan = {
    ...surfPlanData,
    non_participating_guests: surfPlanData.non_participating_guests.filter ( guest => {
      if (guest.student_id === studentId){
        addedStudent = guest;
        return false;
      } else {
        return true;
      }
    }),
    slots: surfPlanData.slots.map((slot, sIndex) => {
      if (sIndex === slotIndex) {
        return {
          ...slot,
          groups: slot.groups.map((group, gIndex) => {
            if (gIndex === groupIndex) {
              return {
                ...group,
                students: [...group.students, addedStudent]
              };
            }
            return group;
          })
        };
      }
      return slot;
    })
  };
  setSurfPlan(updatedPlan);
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
  };
  // drag and drop student from one group to other
  // 1. select a student from a group by clicking and holding
  // 2. drop student to other group in same or different slot
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
