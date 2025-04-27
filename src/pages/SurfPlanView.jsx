import React, { useEffect, useState } from "react";
import { fetchSurfPlan } from "../api/surfPlanApi";
import SurfPlan from "../components/surfPlan/SurfPlan";

function SurfPlanView() {
  const [surfPlanData, setSurfPlan] = useState([]);
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

  return (
    <div>
      {loading ? (
        <p>Loading... 🎉</p>
      ) : (
        // Render a single SurfPlan component with the plan
        surfPlanData ? <SurfPlan plan={surfPlanData} /> : <p>No surf plan available.</p>
      )}
    </div>
  );
}

export default SurfPlanView;
