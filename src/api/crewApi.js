import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

// Crew Members API
export const fetchCrewMembers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crew/members`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch crew members:", error);
    throw error;
  }
};

export const createCrewMember = async (crewMember) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crew/members`, crewMember);
    return response.data;
  } catch (error) {
    console.error("Failed to create crew member:", error);
    throw error;
  }
};

export const updateCrewMember = async (id, crewMember) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/crew/members/${id}`, crewMember);
    return response.data;
  } catch (error) {
    console.error("Failed to update crew member:", error);
    throw error;
  }
};

export const deleteCrewMember = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/crew/members/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete crew member:", error);
    throw error;
  }
};

// Positions API
export const fetchPositions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crew/positions`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch positions:", error);
    throw error;
  }
};

export const createPosition = async (position) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crew/positions`, position);
    return response.data;
  } catch (error) {
    console.error("Failed to create position:", error);
    throw error;
  }
};

export const updatePosition = async (id, position) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/crew/positions/${id}`, position);
    return response.data;
  } catch (error) {
    console.error("Failed to update position:", error);
    throw error;
  }
};

export const deletePosition = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/crew/positions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete position:", error);
    throw error;
  }
};

// Teams API
export const fetchTeams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crew/teams`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    throw error;
  }
};

export const createTeam = async (team) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crew/teams`, team);
    return response.data;
  } catch (error) {
    console.error("Failed to create team:", error);
    throw error;
  }
};

export const updateTeam = async (id, team) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/crew/teams/${id}`, team);
    return response.data;
  } catch (error) {
    console.error("Failed to update team:", error);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/crew/teams/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete team:", error);
    throw error;
  }
};

// Crew Calendar API
export const fetchCrewCalendar = async (startDate, endDate, teamId = null) => {
  try {
    let url = `${API_BASE_URL}/crew/calendar?start_date=${startDate}&end_date=${endDate}`;
    if (teamId) {
      url += `&team_id=${teamId}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch crew calendar:", error);
    throw error;
  }
};

// Crew Assignments API
export const fetchCrewAssignments = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/crew/assignments?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch crew assignments:", error);
    throw error;
  }
};

export const createCrewAssignment = async (assignment) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crew/assignments`, assignment);
    return response.data;
  } catch (error) {
    console.error("Failed to create crew assignment:", error);
    throw error;
  }
};

export const updateCrewAssignment = async (id, assignment) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/crew/assignments/${id}`, assignment);
    return response.data;
  } catch (error) {
    console.error("Failed to update crew assignment:", error);
    throw error;
  }
};

export const deleteCrewAssignment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/crew/assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete crew assignment:", error);
    throw error;
  }
};

// Accommodation API
export const fetchAccommodations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crew/accommodations`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch accommodations:", error);
    throw error;
  }
};

export const createAccommodation = async (accommodation) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crew/accommodations`, accommodation);
    return response.data;
  } catch (error) {
    console.error("Failed to create accommodation:", error);
    throw error;
  }
};

export const updateAccommodation = async (id, accommodation) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/crew/accommodations/${id}`, accommodation);
    return response.data;
  } catch (error) {
    console.error("Failed to update accommodation:", error);
    throw error;
  }
};

export const deleteAccommodation = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/crew/accommodations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete accommodation:", error);
    throw error;
  }
};

// Accommodation Assignments API
export const fetchAccommodationAssignments = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/crew/accommodation-assignments?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch accommodation assignments:", error);
    throw error;
  }
};

export const createAccommodationAssignment = async (assignment) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crew/accommodation-assignments`, assignment);
    return response.data;
  } catch (error) {
    console.error("Failed to create accommodation assignment:", error);
    throw error;
  }
};

export const updateAccommodationAssignment = async (id, assignment) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/crew/accommodation-assignments/${id}`, assignment);
    return response.data;
  } catch (error) {
    console.error("Failed to update accommodation assignment:", error);
    throw error;
  }
};

export const deleteAccommodationAssignment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/crew/accommodation-assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete accommodation assignment:", error);
    throw error;
  }
};
