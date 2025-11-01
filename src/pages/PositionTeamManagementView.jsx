import React, { useState, useEffect } from "react";
import {
  fetchPositions,
  createPosition,
  updatePosition,
  deletePosition,
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../api/crewApi";

const PositionTeamManagementView = () => {
  const [positions, setPositions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("positions");

  // Position form state
  const [editingPosition, setEditingPosition] = useState(null);
  const [positionForm, setPositionForm] = useState({
    name: "",
    description: "",
    team_id: "",
  });

  // Team form state
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [positionsData, teamsData] = await Promise.all([
        fetchPositions(),
        fetchTeams(),
      ]);
      setPositions(positionsData);
      setTeams(teamsData);
    } catch (err) {
      setError("Failed to load data");
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Position handlers
  const handlePositionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPosition) {
        await updatePosition(editingPosition.id, positionForm);
      } else {
        await createPosition(positionForm);
      }
      setPositionForm({ name: "", description: "", team_id: "" });
      setEditingPosition(null);
      await loadData();
    } catch (err) {
      setError("Failed to save position");
      console.error("Failed to save position:", err);
    }
  };

  const handleEditPosition = (position) => {
    setEditingPosition(position);
    setPositionForm({
      name: position.name,
      description: position.description || "",
      team_id: position.team_id || "",
    });
  };

  const handleDeletePosition = async (id) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      try {
        await deletePosition(id);
        await loadData();
      } catch (err) {
        setError("Failed to delete position");
        console.error("Failed to delete position:", err);
      }
    }
  };

  const cancelPositionEdit = () => {
    setEditingPosition(null);
    setPositionForm({ name: "", description: "", team_id: "" });
  };

  // Team handlers
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, teamForm);
      } else {
        await createTeam(teamForm);
      }
      setTeamForm({ name: "", description: "" });
      setEditingTeam(null);
      await loadData();
    } catch (err) {
      setError("Failed to save team");
      console.error("Failed to save team:", err);
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description || "",
    });
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam(id);
        await loadData();
      } catch (err) {
        setError("Failed to delete team");
        console.error("Failed to delete team:", err);
      }
    }
  };

  const cancelTeamEdit = () => {
    setEditingTeam(null);
    setTeamForm({ name: "", description: "" });
  };

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : "No Team";
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Position & Team Management</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "positions" ? "active" : ""}`}
            onClick={() => setActiveTab("positions")}
          >
            Positions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            Teams
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {activeTab === "positions" && (
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {editingPosition ? "Edit Position" : "Add Position"}
                    </h5>
                    <form onSubmit={handlePositionSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={positionForm.name}
                          onChange={(e) =>
                            setPositionForm({
                              ...positionForm,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={positionForm.description}
                          onChange={(e) =>
                            setPositionForm({
                              ...positionForm,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Team</label>
                        <select
                          className="form-select"
                          value={positionForm.team_id}
                          onChange={(e) =>
                            setPositionForm({
                              ...positionForm,
                              team_id: e.target.value,
                            })
                          }
                        >
                          <option value="">No Team</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          {editingPosition ? "Update" : "Add"}
                        </button>
                        {editingPosition && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelPositionEdit}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Positions List</h5>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Team</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No positions found
                            </td>
                          </tr>
                        ) : (
                          positions.map((position) => (
                            <tr key={position.id}>
                              <td>{position.name}</td>
                              <td>{position.description || "-"}</td>
                              <td>
                                <span className="badge bg-info">
                                  {getTeamName(position.team_id)}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEditPosition(position)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleDeletePosition(position.id)
                                  }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {editingTeam ? "Edit Team" : "Add Team"}
                    </h5>
                    <form onSubmit={handleTeamSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={teamForm.name}
                          onChange={(e) =>
                            setTeamForm({ ...teamForm, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={teamForm.description}
                          onChange={(e) =>
                            setTeamForm({
                              ...teamForm,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          {editingTeam ? "Update" : "Add"}
                        </button>
                        {editingTeam && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelTeamEdit}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Teams List</h5>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Positions Count</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teams.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No teams found
                            </td>
                          </tr>
                        ) : (
                          teams.map((team) => (
                            <tr key={team.id}>
                              <td>{team.name}</td>
                              <td>{team.description || "-"}</td>
                              <td>
                                {
                                  positions.filter(
                                    (p) => p.team_id === team.id
                                  ).length
                                }
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEditTeam(team)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteTeam(team.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PositionTeamManagementView;
