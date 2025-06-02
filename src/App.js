import React, { useState } from "react";
import SurfPlanView from "./pages/SurfPlanView";
import GuestListView from "./pages/GuestListView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
    const [view, setView] = useState("surf");

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mt-3">
                <div className="btn-group mb-4">
                    <button
                        className={`btn btn-${view === "surf" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("surf")}
                    >
                        Surf Plan
                    </button>
                    <button
                        className={`btn btn-${view === "guest" ? "primary" : "outline-primary"}`}
                        onClick={() => setView("guest")}
                    >
                        Guest Diet List
                    </button>
                </div>

                {view === "surf" && <SurfPlanView />}
                {view === "guest" && <GuestListView />}
            </div>
        </DndProvider>
    );
}

export default App;
