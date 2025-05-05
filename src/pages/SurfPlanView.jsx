import React, { useEffect, useState } from "react";
import { fetchSurfPlan } from "../api/surfPlanApi";
import SurfPlan from "../components/surfPlan/SurfPlan";

function SurfPlanView() {
  const [surfPlanData, setSurfPlan] = useState([]);
  // const [nonParticipatingGuests, setNonParticipatingGuests] = useState(false);
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
    console.log(`Student with ID ${studentId} has been removed.`);
  };

  // const toggleNonParticipatingGuest = () => {
  //   setNonParticipatingGuests(true)
  // };

  return (
    <div>
      {loading ? (
        <p>Loading... 🎉</p>
      ) : (
        surfPlanData ? <SurfPlan plan={surfPlanData} removeStudent={removeStudent}/> : <p>No surf plan available.</p>
      )}

    </div>
  );
}

export default SurfPlanView;
