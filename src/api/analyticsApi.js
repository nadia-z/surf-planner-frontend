import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

/**
 * Fetch age group statistics
 * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
 * @returns {Promise} Age group statistics
 */
export const fetchAgeGroupStatistics = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/age-groups`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch age group statistics:", error);
    throw error;
  }
};

/**
 * Fetch surf lesson statistics
 * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
 * @returns {Promise} Surf lesson statistics
 */
export const fetchSurfLessonStatistics = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/surf-lessons`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch surf lesson statistics:", error);
    throw error;
  }
};

/**
 * Fetch skill level distribution
 * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
 * @returns {Promise} Skill level distribution
 */
export const fetchSkillLevelDistribution = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/skill-levels`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch skill level distribution:", error);
    throw error;
  }
};

/**
 * Fetch monthly statistics for a specific year
 * @param {number} year - The year to fetch statistics for
 * @returns {Promise} Monthly statistics
 */
export const fetchMonthlyStatistics = async (year) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/monthly/${year}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch monthly statistics:", error);
    throw error;
  }
};

/**
 * Fetch comprehensive statistics
 * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
 * @returns {Promise} Comprehensive statistics
 */
export const fetchComprehensiveStatistics = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/comprehensive`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comprehensive statistics:", error);
    throw error;
  }
};
