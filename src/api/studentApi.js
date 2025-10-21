import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Adjust if FastAPI is hosted elsewhere

export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
};

/**
 * Fetch all students who might intersect the window [startISO, endISO]
 * Your backend endpoint can ignore the range and return everything; the UI will filter locally.
 * Expected Student shape:
 * { id, first_name, last_name, age_group, level, arrival, departure, number_of_surf_lessons, booking_status }
 */
export async function fetchStudentsByRange(startISO, endISO) {
  const url = `${API_BASE_URL}/students?start=${startISO}&end=${endISO}`;
  const { data } = await axios.get(url);
  return data;
}
