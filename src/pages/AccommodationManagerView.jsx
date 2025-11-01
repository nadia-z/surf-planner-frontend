import React, { useState, useEffect, useCallback } from "react";
import {
  fetchAccommodations,
  fetchAccommodationAssignments,
  createAccommodationAssignment,
  deleteAccommodationAssignment,
  fetchCrewMembers,
} from "../api/crewApi";
import { format, parseISO } from "date-fns";
import "./AccommodationManagerView.css";

const AccommodationManagerView = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2025-09-30");

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    crew_member_id: "",
    accommodation_id: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accommodationsData, assignmentsData, crewData] =
        await Promise.all([
          fetchAccommodations(),
          fetchAccommodationAssignments(startDate, endDate),
          fetchCrewMembers(),
        ]);
      setAccommodations(accommodationsData);
      setAssignments(assignmentsData);
      setCrewMembers(crewData);
    } catch (err) {
      setError("Failed to load data");
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCrewMemberName = (crewMemberId) => {
    const member = crewMembers.find((m) => m.id === crewMemberId);
    return member
      ? `${member.first_name} ${member.last_name}`
      : "Unknown";
  };

  const checkDoubleBooking = (accommodationId, startDate, endDate, excludeAssignmentId = null) => {
    const newStart = parseISO(startDate);
    const newEnd = parseISO(endDate);

    return assignments.some((assignment) => {
      if (excludeAssignmentId && assignment.id === excludeAssignmentId) {
        return false;
      }
      if (assignment.accommodation_id !== accommodationId) {
        return false;
      }

      const existingStart = parseISO(assignment.start_date);
      const existingEnd = parseISO(assignment.end_date);

      // Check for overlap
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  const checkTentChangesDuringStay = (crewMemberId, accommodationId, startDate, endDate) => {
    const crewAssignments = assignments.filter(
      (a) => a.crew_member_id === crewMemberId
    );

    if (crewAssignments.length === 0) return false;

    const newStart = parseISO(startDate);
    const newEnd = parseISO(endDate);

    for (const assignment of crewAssignments) {
      if (assignment.accommodation_id === accommodationId) continue;

      const existingStart = parseISO(assignment.start_date);
      const existingEnd = parseISO(assignment.end_date);

      // Check if there's any overlap with different accommodation
      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return true;
      }
    }

    return false;
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();

    // Validate no double booking
    if (
      checkDoubleBooking(
        parseInt(assignmentForm.accommodation_id),
        assignmentForm.start_date,
        assignmentForm.end_date
      )
    ) {
      setError(
        "This accommodation is already booked for the selected dates"
      );
      return;
    }

    // Validate no tent changes during stay
    if (
      checkTentChangesDuringStay(
        parseInt(assignmentForm.crew_member_id),
        parseInt(assignmentForm.accommodation_id),
        assignmentForm.start_date,
        assignmentForm.end_date
      )
    ) {
      setError(
        "This crew member is already assigned to a different accommodation during this period"
      );
      return;
    }

    try {
      await createAccommodationAssignment(assignmentForm);
      setAssignmentForm({
        crew_member_id: "",
        accommodation_id: "",
        start_date: "",
        end_date: "",
        notes: "",
      });
      setShowAssignModal(false);
      setSelectedAccommodation(null);
      await loadData();
    } catch (err) {
      setError("Failed to create assignment");
      console.error("Failed to create assignment:", err);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this assignment?")
    ) {
      try {
        await deleteAccommodationAssignment(id);
        await loadData();
      } catch (err) {
        setError("Failed to delete assignment");
        console.error("Failed to delete assignment:", err);
      }
    }
  };

  const openAssignModal = (accommodation = null) => {
    setSelectedAccommodation(accommodation);
    if (accommodation) {
      setAssignmentForm({
        ...assignmentForm,
        accommodation_id: accommodation.id,
      });
    }
    setShowAssignModal(true);
    setError(null);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedAccommodation(null);
    setAssignmentForm({
      crew_member_id: "",
      accommodation_id: "",
      start_date: "",
      end_date: "",
      notes: "",
    });
    setError(null);
  };

  const getAssignmentsForAccommodation = (accommodationId) => {
    return assignments.filter((a) => a.accommodation_id === accommodationId);
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Accommodation Manager</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={() => openAssignModal()}
              >
                New Assignment
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
        <div className="row">
          {accommodations.map((accommodation) => {
            const accommodationAssignments =
              getAssignmentsForAccommodation(accommodation.id);
            return (
              <div key={accommodation.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card accommodation-card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">{accommodation.name}</h5>
                      <small className="text-muted">
                        {accommodation.type} - Capacity:{" "}
                        {accommodation.capacity}
                      </small>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => openAssignModal(accommodation)}
                    >
                      Assign
                    </button>
                  </div>
                  <div className="card-body">
                    {accommodationAssignments.length === 0 ? (
                      <p className="text-muted">No assignments</p>
                    ) : (
                      <div className="assignments-list">
                        {accommodationAssignments
                          .sort(
                            (a, b) =>
                              new Date(a.start_date) - new Date(b.start_date)
                          )
                          .map((assignment) => (
                            <div
                              key={assignment.id}
                              className="assignment-item mb-2 p-2 border rounded"
                            >
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="fw-bold">
                                    {getCrewMemberName(
                                      assignment.crew_member_id
                                    )}
                                  </div>
                                  <div className="text-muted small">
                                    {format(
                                      parseISO(assignment.start_date),
                                      "MMM d"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                      parseISO(assignment.end_date),
                                      "MMM d, yyyy"
                                    )}
                                  </div>
                                  {assignment.notes && (
                                    <div className="text-muted small mt-1">
                                      {assignment.notes}
                                    </div>
                                  )}
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleDeleteAssignment(assignment.id)
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={closeAssignModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedAccommodation
                  ? `Assign to ${selectedAccommodation.name}`
                  : "New Accommodation Assignment"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeAssignModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAssignSubmit}>
                <div className="mb-3">
                  <label className="form-label">Crew Member</label>
                  <select
                    className="form-select"
                    value={assignmentForm.crew_member_id}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        crew_member_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select crew member</option>
                    {crewMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.first_name} {member.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Accommodation</label>
                  <select
                    className="form-select"
                    value={assignmentForm.accommodation_id}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        accommodation_id: e.target.value,
                      })
                    }
                    required
                    disabled={selectedAccommodation !== null}
                  >
                    <option value="">Select accommodation</option>
                    {accommodations.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={assignmentForm.start_date}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        start_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={assignmentForm.end_date}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        end_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={assignmentForm.notes}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeAssignModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationManagerView;
