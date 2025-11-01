import React, { useState, useEffect } from "react";
import {
  fetchCrewAssignments,
  fetchTeams,
  fetchCrewMembers,
} from "../api/crewApi";
import { format, parseISO } from "date-fns";
import "./CrewPlanView.css";

const CrewPlanView = () => {
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2025-09-30");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [startDate, endDate, selectedTeam]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadInitialData = async () => {
    try {
      const [teamsData, crewData] = await Promise.all([
        fetchTeams(),
        fetchCrewMembers(),
      ]);
      setTeams(teamsData);
      setCrewMembers(crewData);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  const loadAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCrewAssignments(startDate, endDate);
      // Filter by team if selected
      const filtered = selectedTeam
        ? data.filter((a) => {
            const member = crewMembers.find((m) => m.id === a.crew_member_id);
            return member && member.team_id === parseInt(selectedTeam);
          })
        : data;
      setAssignments(filtered);
    } catch (err) {
      setError("Failed to load crew assignments");
      console.error("Failed to load crew assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCrewMemberName = (crewMemberId) => {
    const member = crewMembers.find((m) => m.id === crewMemberId);
    return member
      ? `${member.first_name} ${member.last_name}`
      : "Unknown Crew Member";
  };

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : "No Team";
  };

  const groupByCrewMember = () => {
    const grouped = {};
    assignments.forEach((assignment) => {
      const memberId = assignment.crew_member_id;
      if (!grouped[memberId]) {
        grouped[memberId] = [];
      }
      grouped[memberId].push(assignment);
    });
    return grouped;
  };

  const crewMemberAssignments = groupByCrewMember();

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Crew Plan Overview</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter by Team</label>
              <select
                className="form-select"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={loadAssignments}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="crew-plan-overview">
          {Object.keys(crewMemberAssignments).length === 0 ? (
            <div className="alert alert-info">
              No crew assignments found for the selected date range and team
            </div>
          ) : (
            <div className="row">
              {Object.entries(crewMemberAssignments).map(
                ([memberId, memberAssignments]) => {
                  const member = crewMembers.find(
                    (m) => m.id === parseInt(memberId)
                  );
                  return (
                    <div key={memberId} className="col-md-6 col-lg-4 mb-4">
                      <div className="card crew-member-card">
                        <div className="card-header">
                          <h5 className="mb-0">
                            {getCrewMemberName(parseInt(memberId))}
                          </h5>
                          {member && (
                            <span className="badge bg-info mt-2">
                              {getTeamName(member.team_id)}
                            </span>
                          )}
                        </div>
                        <div className="card-body">
                          <div className="assignments-timeline">
                            {memberAssignments
                              .sort(
                                (a, b) =>
                                  new Date(a.start_date) -
                                  new Date(b.start_date)
                              )
                              .map((assignment, idx) => (
                                <div
                                  key={idx}
                                  className="assignment-item mb-3"
                                >
                                  <div className="fw-bold">
                                    {assignment.position_name || "Unknown Position"}
                                  </div>
                                  <div className="text-muted small">
                                    {format(
                                      parseISO(assignment.start_date),
                                      "MMM d, yyyy"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                      parseISO(assignment.end_date),
                                      "MMM d, yyyy"
                                    )}
                                  </div>
                                  {assignment.notes && (
                                    <div className="text-muted small mt-1">
                                      <em>{assignment.notes}</em>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CrewPlanView;
