import React, { useState, useEffect } from "react";
import { fetchCrewCalendar, fetchTeams } from "../api/crewApi";
import { format, eachDayOfInterval, parseISO } from "date-fns";
import "./CrewCalendarView.css";

const CrewCalendarView = () => {
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2025-09-30");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    loadCalendarData();
  }, [startDate, endDate, selectedTeam]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTeams = async () => {
    try {
      const data = await fetchTeams();
      setTeams(data);
    } catch (err) {
      console.error("Failed to load teams:", err);
    }
  };

  const loadCalendarData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCrewCalendar(
        startDate,
        endDate,
        selectedTeam || null
      );
      setCalendarData(data);
    } catch (err) {
      setError("Failed to load calendar data");
      console.error("Failed to load calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInRange = () => {
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      return eachDayOfInterval({ start, end });
    } catch (err) {
      console.error("Invalid date range:", err);
      return [];
    }
  };

  const days = getDaysInRange();

  // Group calendar data by position
  const groupByPosition = () => {
    const grouped = {};
    calendarData.forEach((entry) => {
      const positionName = entry.position_name || "Unassigned";
      if (!grouped[positionName]) {
        grouped[positionName] = {};
      }
      const dateKey = entry.date;
      if (!grouped[positionName][dateKey]) {
        grouped[positionName][dateKey] = [];
      }
      grouped[positionName][dateKey].push(entry);
    });
    return grouped;
  };

  const positionData = groupByPosition();

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Crew Calendar Overview</h1>

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
                onClick={loadCalendarData}
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
        <div className="crew-calendar-container">
          <div className="table-responsive">
            <table className="table table-bordered table-sm crew-calendar-table">
              <thead>
                <tr>
                  <th className="position-column">Position</th>
                  {days.map((day) => (
                    <th key={day.toISOString()} className="date-column">
                      <div>{format(day, "EEE")}</div>
                      <div className="text-muted small">
                        {format(day, "MMM d")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(positionData).length === 0 ? (
                  <tr>
                    <td colSpan={days.length + 1} className="text-center">
                      No crew assignments found for the selected date range
                    </td>
                  </tr>
                ) : (
                  Object.entries(positionData).map(
                    ([positionName, dateMap]) => (
                      <tr key={positionName}>
                        <td className="position-column fw-bold">
                          {positionName}
                        </td>
                        {days.map((day) => {
                          const dateKey = format(day, "yyyy-MM-dd");
                          const assignments = dateMap[dateKey] || [];
                          return (
                            <td
                              key={day.toISOString()}
                              className="assignment-cell"
                            >
                              {assignments.map((assignment, idx) => (
                                <div
                                  key={idx}
                                  className="crew-member-badge badge bg-primary mb-1"
                                >
                                  {assignment.crew_member_name}
                                </div>
                              ))}
                            </td>
                          );
                        })}
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewCalendarView;
