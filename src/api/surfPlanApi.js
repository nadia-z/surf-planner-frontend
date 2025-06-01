import axios from "axios";

// example: http://127.0.0.1:8000/surfplan?date=2025-06-01
const API_BASE_URL = "http://localhost:8000"; // Adjust if FastAPI is hosted elsewhere
export const fetchSurfPlan = async (date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/surfplan`, {
      params: { plan_date: date },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch surf plan:", error);
    throw error;
  }
};
