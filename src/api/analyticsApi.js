import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

/**
 * Fetch flexible analytics data with customizable options
 * @param {Object} options - Analytics options
 * @param {string} options.startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} options.endDate - End date in ISO format (YYYY-MM-DD)
 * @param {string} options.interval - Time interval: 'daily', 'weekly', or 'monthly'
 * @param {Array<string>} options.metrics - Array of metrics to include
 * @returns {Promise} Flexible analytics data
 */
export const fetchFlexibleAnalytics = async (options) => {
  try {
    const { startDate, endDate, interval = 'daily', metrics = [] } = options;

    const params = {
      start_date: startDate,
      end_date: endDate,
      interval,
    };

    // Add metrics as comma-separated list if provided
    if (metrics && metrics.length > 0) {
      params.metrics = metrics.join(',');
    }

    const response = await axios.get(`${API_BASE_URL}/analytics/flexible`, {
      params
    });
    console.log("`${API_BASE_URL}/analytics/flexible` -> response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch flexible analytics:", error);
    throw error;
  }
};
