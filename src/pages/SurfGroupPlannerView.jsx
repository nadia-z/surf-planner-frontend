import React, {useState, useEffect} from "react";
import {Button, Col, Offcanvas, Row} from "react-bootstrap";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {format, startOfWeek, addDays, subDays, parseISO, isAfter, isBefore} from "date-fns";
import axios from "axios";
import Student from "../components/Student/Student";
import Person from "../components/person/Person";
import Group from "../components/group/group";
import Slot from "../components/slot/slot";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LEVEL_COLORS = {
    beginner: "#d4f1f9", "beginner plus": "#d1e7dd", intermediate: "#fff3cd", teens: "#e0c3fc", kids: "#fde2e2",
};

const LEVEL_PRIORITY = {
    beginner: 1, "beginner plus": 2, intermediate: 3, teens: 4, kids: 5,
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
        circles.push(<span
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
        />);
    }
    return <div className="d-flex">{circles}</div>;
}

function SurfGroupPlannerView() {
    const [viewStartDate, setViewStartDate] = useState(startOfWeek(new Date(), {weekStartsOn: 0}));
    const [studentsData, setStudentsData] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/students/groups?sunday=2025-07-06`);
            setStudentsData(res.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        }
    };

    const goToPreviousDay = () => {
        setViewStartDate(prev => subDays(prev, 1));
    };

    const goToNextDay = () => {
        setViewStartDate(prev => addDays(prev, 1));
    };


    function addStudentToGroup(student) {
        console.log("Add student to group" + student)
    }

    function removeStudent(student) {
        console.log("remove student from group" + student)
    }

    return (<DndProvider backend={HTML5Backend}>
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Surf Group Planner</h5>
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

            {(studentsData.length === 0) && (<div className="alert alert-warning text-center">
                No students available for this week.
            </div>)}

            <div className="d-flex overflow-auto flex-nowrap gap-3 px-2">
                {(studentsData && studentsData.beginner) && (
                    <Group group={
                        {
                            students: studentsData.beginner,
                            level: "Beginner",
                            age_group: "Adults"
                        }}
                           addStudentToGroup={addStudentToGroup}
                           groupIndex={0}
                           non_participating_guests={[]}
                           removeStudent={removeStudent}
                           slotIndex={0}
                    ></Group>
                )}

                {(studentsData && studentsData.beginner_plus) && (
                    <Group group={
                        {
                            students: studentsData.beginner_plus,
                            level: "Beginner Plus",
                            age_group: "Adults"
                        }}
                           addStudentToGroup={addStudentToGroup}
                           groupIndex={0}
                           non_participating_guests={[]}
                           removeStudent={removeStudent}
                           slotIndex={0}
                    ></Group>
                )}

                {(studentsData && studentsData.intermediate) && (
                    <Group group={
                        {
                            students: studentsData.intermediate,
                            level: "Intermediate",
                            age_group: "Adults"
                        }}
                           addStudentToGroup={addStudentToGroup}
                           groupIndex={0}
                           non_participating_guests={[]}
                           removeStudent={removeStudent}
                           slotIndex={0}
                    ></Group>
                )}

                {(studentsData && studentsData.teens) && (
                    <Group group={
                        {
                            students: studentsData.teens,
                            level: "Teens",
                            age_group: "Teens"
                        }}
                           addStudentToGroup={addStudentToGroup}
                           groupIndex={0}
                           non_participating_guests={[]}
                           removeStudent={removeStudent}
                           slotIndex={0}
                    ></Group>
                )}

                {(studentsData && studentsData.kids) && (
                    <Group group={
                        {
                            students: studentsData.kids,
                            level: "Kids",
                            age_group: "Kids"
                        }}
                           addStudentToGroup={addStudentToGroup}
                           groupIndex={0}
                           non_participating_guests={[]}
                           removeStudent={removeStudent}
                           slotIndex={0}
                    ></Group>
                )}

            </div>
        </div>
    </DndProvider>);
}

export default SurfGroupPlannerView;
