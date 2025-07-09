import React, { useState, useEffect } from "react";
import { Button, Col, Offcanvas, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format, startOfWeek, addDays, subDays, parseISO, isAfter, isBefore } from "date-fns";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LEVEL_COLORS = {
    beginner: "#d4f1f9",
    "beginner plus": "#d1e7dd",
    intermediate: "#fff3cd",
    teens: "#e0c3fc",
    kids: "#fde2e2",
};

const LEVEL_PRIORITY = {
    beginner: 1,
    "beginner plus": 2,
    intermediate: 3,
    teens: 4,
    kids: 5,
};

function resolveAgeGroup(groupValue) {
    if (!groupValue) return "adult";
    const value = groupValue.toLowerCase();
    if (value.includes("kid")) return "kids";
    if (value.includes("teen")) return "teens";
    if (value.includes("adult")) return "adult";
    return "adult";
}

function resolveLevel(student) {
    const group = resolveAgeGroup(student.age_group);
    if (group === "kids") return "kids";
    if (group === "teens") return "teens";
    return student.level ? student.level.toLowerCase() : "beginner";
}

function getSortedStudentsByLevel(students) {
    return [...students].sort((a, b) => {
        const levelA = resolveLevel(a);
        const levelB = resolveLevel(b);
        return (LEVEL_PRIORITY[levelA] || 99) - (LEVEL_PRIORITY[levelB] || 99);
    });
}

function renderLessonCircles(taken, total) {
    const circles = [];
    for (let i = 0; i < total; i++) {
        circles.push(
            <span
                key={i}
                style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    marginRight: 2,
                    borderRadius: "50%",
                    backgroundColor: i < taken ? "#333" : "transparent",
                    border: "1px solid #333"
                }}
            />
        );
    }
    return <div className="d-flex">{circles}</div>;
}

function WeekPlannerView() {
    const [viewStartDate, setViewStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
    const [studentsData, setStudentsData] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState({});
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (studentsData.length > 0) {
            handleGenerateWeek();
        }
    }, [studentsData, viewStartDate]);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/students?start=2025-05-01&end=2025-11-01`);
            setStudentsData(res.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        }
    };

    const handleGenerateWeek = () => {
        const allAssigned = {};
        const today = addDays(viewStartDate, 6);

        const studentTracker = studentsData.map(student => {
            const lessonStart = addDays(parseISO(student.arrival), 1);
            const lessonEnd = parseISO(student.departure);
            let assigned = 0;
            const daily = {};

            for (let i = 0; i < 100; i++) {
                const day = addDays(lessonStart, i);
                if (isBefore(day, lessonEnd) && assigned < student.number_of_surf_lessons) {
                    const key = day.toISOString().split("T")[0];
                    assigned++;
                    daily[key] = { ...student, assignedLessons: assigned };
                }
            }

            return daily;
        });

        for (let i = 0; i < 7; i++) {
            const day = addDays(viewStartDate, i);
            const key = day.toISOString().split("T")[0];
            allAssigned[key] = [];

            studentTracker.forEach(tracker => {
                if (tracker[key]) {
                    allAssigned[key].push(tracker[key]);
                }
            });
        }

        setAssignedStudents(allAssigned);
    };

    const goToPreviousDay = () => {
        setViewStartDate(prev => subDays(prev, 1));
    };

    const goToNextDay = () => {
        setViewStartDate(prev => addDays(prev, 1));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Week Planner View</h5>
                    <div className="d-flex align-items-center">
                        <Button size="sm" onClick={goToPreviousDay} className="me-2">←</Button>
                        <input
                            type="date"
                            value={viewStartDate.toISOString().split('T')[0]}
                            onChange={(e) => setViewStartDate(new Date(e.target.value))}
                            className="form-control form-control-sm me-2"
                        />
                        <Button size="sm" onClick={goToNextDay} className="me-2">→</Button>
                    </div>
                </div>

                {Object.keys(assignedStudents).every(date => assignedStudents[date].length === 0) && (
                    <div className="alert alert-warning text-center">
                        No students available for this week.
                    </div>
                )}

                <Row>
                    {Array.from({ length: 7 }).map((_, i) => {
                        const date = addDays(viewStartDate, i);
                        const dateKey = date.toISOString().split('T')[0];
                        const students = getSortedStudentsByLevel(assignedStudents[dateKey] || []);
                        return (
                            <Col key={dateKey} style={{ minWidth: "14.2%" }}>
                                <div className="text-center fw-bold small">
                                    {format(date, "EEE dd.MM")}
                                </div>
                                <div className="small mb-2">Total: {students.length}</div>
                                {students.map((student) => {
                                    const tooltip = `${student.first_name} ${student.last_name}\nLevel: ${resolveLevel(student)}\nAge Group: ${resolveAgeGroup(student.age_group)}\nLessons: ${student.number_of_surf_lessons}\nArrival: ${student.arrival}\nDeparture: ${student.departure}\nTent: ${student.tent || "N/A"}`;
                                    return (
                                        <div
                                            key={student.id}
                                            title={tooltip}
                                            className="p-1 m-1 rounded"
                                            style={{
                                                backgroundColor: LEVEL_COLORS[resolveLevel(student)] || '#eee',
                                                fontSize: "0.65rem",
                                                cursor: "help"
                                            }}
                                        >
                                            <div>{student.first_name} {student.last_name}</div>
                                            {renderLessonCircles(student.assignedLessons, student.number_of_surf_lessons)}
                                        </div>
                                    );
                                })}
                            </Col>
                        );
                    })}
                </Row>

                <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Available Students</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body style={{ fontSize: "0.75rem" }}>
                        {studentsData.filter(s => !Object.values(assignedStudents).some(list => list.some(as => as.id === s.id)) && s.number_of_surf_lessons > 0).map(s => (
                            <div key={s.id}>{s.first_name} {s.last_name}</div>
                        ))}
                    </Offcanvas.Body>
                </Offcanvas>

                <Button
                    variant="secondary"
                    style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}
                    size="sm"
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    {showSidebar ? "→" : "←"}
                </Button>
            </div>
        </DndProvider>
    );
}

export default WeekPlannerView;
