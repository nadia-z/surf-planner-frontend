import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Adjust if FastAPI is hosted elsewhere

export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
};
