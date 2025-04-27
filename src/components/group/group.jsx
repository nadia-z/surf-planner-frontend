import React from "react";
import Students from "../Students/Students";
import "./group.css";

const Group = ({ group }) => (
  <div className="groups-item">
  <p>{group.level} – {group.age_group}</p>
  <Students key={group.students} students={group.students} />
  <a href="#" id="btn-participants">+ add students</a>
  <div className="instructor-circle">
    <p className="instructor-label">EH</p>
  </div>
  </div>
);

export default Group;
