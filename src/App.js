import React, { useState } from "react";
import GuestListView from "./pages/GuestListView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SurfPlanView from "./pages/SurfPlanView";
import WeekTidePlannerView from "./pages/WeekTidePlannerView";
import WeeklyGroupMatrixView from "./pages/WeeklyGroupMatrixView";
import AnalyticsView from "./pages/AnalyticsView";
import CrewCalendarView from "./pages/CrewCalendarView";
import PositionTeamManagementView from "./pages/PositionTeamManagementView";
import CrewPlanView from "./pages/CrewPlanView";
import AccommodationManagerView from "./pages/AccommodationManagerView";

function App() {
    const [view, setView] = useState("surf plan view");

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mt-3">
                <div className="btn-group mb-4">
                    <button
                        className={`btn btn-${view === "surf plan view" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("surf plan view")}
                    >
                        Surf Plan
                    </button>
                    <button
                        className={`btn btn-${view === "weekly group matrix view" ? "primary" : "outline-primary"}`}
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
                        className={`btn btn-${view === "tide" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("tide")}
                    >
                        WeekSlotPlanner
                    </button>

                    <button
                        className={`btn btn-${view === "analytics" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("analytics")}
                    >
                        Analytics
                    </button>

                    <button
                        className={`btn btn-${view === "crew calendar" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("crew calendar")}
                    >
                        Crew Calendar
                    </button>

                    <button
                        className={`btn btn-${view === "crew plan" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("crew plan")}
                    >
                        Crew Plan
                    </button>

                    <button
                        className={`btn btn-${view === "position management" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("position management")}
                    >
                        Positions & Teams
                    </button>

                    <button
                        className={`btn btn-${view === "accommodation" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("accommodation")}
                    >
                        Accommodation
                    </button>
                </div>

                {view === "weekly group matrix view" && <WeeklyGroupMatrixView />}
                {view === "guest" && <GuestListView />}
                {view === "surf plan view" && <SurfPlanView />}
                {view === "tide" && <WeekTidePlannerView />}
                {view === "analytics" && <AnalyticsView />}
                {view === "crew calendar" && <CrewCalendarView />}
                {view === "crew plan" && <CrewPlanView />}
                {view === "position management" && <PositionTeamManagementView />}
                {view === "accommodation" && <AccommodationManagerView />}
            </div>
        </DndProvider>
    );
}

export default App;
