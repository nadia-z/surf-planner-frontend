import React, { useState } from "react";
import GuestListView from "./pages/GuestListView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SurfPlanView from "./pages/SurfPlanView";
import WeekTidePlannerView from "./pages/WeekTidePlannerView";
import WeeklyGroupMatrixView from "./pages/WeeklyGroupMatrixView";

function App() {
    const [view, setView] = useState("surf");

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mt-3">
                <div className="btn-group mb-4">
                    <button
                        className={`btn btn-${view === "surf" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("surf plan view")}
                    >
                        Surf Plan
                    </button>
                    <button
                        className={`btn btn-${view === "surf" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("weekly group matrix view")}
                    >
                        Weekly surf group planner
                    </button>

                    <button
                        className={`btn btn-${view === "guest" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("guest")}
                    >
                        Guest Diet List
                    </button>

                    <button
                        className={`btn btn-${view === "guest" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("tide")}
                    >
                        WeekSlotPlanner
                    </button>
                </div>

                {view === "weekly group matrix view" && <WeeklyGroupMatrixView />}
                {view === "guest" && <GuestListView />}
                {view === "surf plan view" && <SurfPlanView />}
                {view === "tide" && <WeekTidePlannerView />}
            </div>
        </DndProvider>
    );
}

export default App;
