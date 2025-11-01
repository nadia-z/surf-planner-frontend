import React, { useState, useEffect, useCallback } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { fetchFlexibleAnalytics } from "../api/analyticsApi";
import "./AnalyticsView.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

// Available metrics for filtering
const AVAILABLE_METRICS = [
  { id: 'age_groups', label: 'Age Groups (Adults/Teens/Kids)' },
  { id: 'lesson_types', label: 'Lesson Types (Surf/Yoga/Skate)' },
  { id: 'skill_levels', label: 'Skill Levels' },
  { id: 'total_guests', label: 'Total Guests' },
  { id: 'guests_with_lessons', label: 'Guests with Lessons' },
  { id: 'guests_without_lessons', label: 'Guests without Lessons' },
];

const AnalyticsView = () => {
  // Date range state
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  
  // Time interval state
  const [interval, setInterval] = useState("monthly");
  
  // Metric filtering state
  const [selectedMetrics, setSelectedMetrics] = useState(AVAILABLE_METRICS.map(m => m.id));
  
  // Data and UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  /**
   * Load analytics data from the flexible endpoint
   */
  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFlexibleAnalytics({
        startDate,
        endDate,
        interval,
        metrics: selectedMetrics
      });
      setAnalyticsData(data);
    } catch (err) {
      setError("Failed to load analytics data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, interval, selectedMetrics]);

  // Load analytics data on mount and when dependencies change
  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  /**
   * Toggle metric selection
   */
  const toggleMetric = (metricId) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  /**
   * Select all metrics
   */
  const selectAllMetrics = () => {
    setSelectedMetrics(AVAILABLE_METRICS.map(m => m.id));
  };

  /**
   * Deselect all metrics
   */
  const deselectAllMetrics = () => {
    setSelectedMetrics([]);
  };

  /**
   * Prepare chart data for age groups (Pie Chart)
   */
  const getAgeGroupChartData = () => {
    if (!analyticsData?.summary?.age_groups) return null;
    
    const { adults = 0, teens = 0, kids = 0 } = analyticsData.summary.age_groups;
    
    return {
      labels: ["Adults", "Teens", "Kids"],
      datasets: [{
        data: [adults, teens, kids],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1
      }]
    };
  };

  /**
   * Prepare chart data for lesson types (Bar Chart)
   */
  const getLessonTypesChartData = () => {
    if (!analyticsData?.summary?.lesson_types) return null;
    
    const lessonTypes = analyticsData.summary.lesson_types;
    const labels = Object.keys(lessonTypes);
    const data = Object.values(lessonTypes);
    
    return {
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      datasets: [{
        label: "Number of Lessons",
        data,
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }]
    };
  };

  /**
   * Prepare chart data for skill levels (Bar Chart)
   */
  const getSkillLevelChartData = () => {
    if (!analyticsData?.summary?.skill_levels) return null;
    
    const skillLevels = analyticsData.summary.skill_levels;
    const labels = Object.keys(skillLevels);
    const data = Object.values(skillLevels);
    
    return {
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1).toLowerCase()),
      datasets: [{
        label: "Number of Students",
        data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }]
    };
  };

  /**
   * Prepare chart data for time series (Line Chart)
   */
  const getTimeSeriesChartData = () => {
    if (!analyticsData?.time_series || analyticsData.time_series.length === 0) return null;
    
    const labels = analyticsData.time_series.map(item => item.period);
    
    const datasets = [];
    
    if (selectedMetrics.includes('total_guests')) {
      datasets.push({
        label: "Total Guests",
        data: analyticsData.time_series.map(item => item.total_guests || 0),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.1
      });
    }
    
    if (selectedMetrics.includes('guests_with_lessons')) {
      datasets.push({
        label: "Guests with Lessons",
        data: analyticsData.time_series.map(item => item.guests_with_lessons || 0),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1
      });
    }
    
    if (selectedMetrics.includes('guests_without_lessons')) {
      datasets.push({
        label: "Guests without Lessons",
        data: analyticsData.time_series.map(item => item.guests_without_lessons || 0),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1
      });
    }
    
    return { labels, datasets };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top"
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const ageGroupChartData = getAgeGroupChartData();
  const lessonTypesChartData = getLessonTypesChartData();
  const skillLevelChartData = getSkillLevelChartData();
  const timeSeriesChartData = getTimeSeriesChartData();

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Analytics Dashboard</h1>

      {/* Controls Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Dashboard Controls</h5>
          
          {/* Date Range and Interval */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="start-date" className="form-label">Start Date</label>
              <input
                id="start-date"
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="end-date" className="form-label">End Date</label>
              <input
                id="end-date"
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="time-interval" className="form-label">Time Interval</label>
              <select
                id="time-interval"
                className="form-select"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Metric Selection */}
          <div className="mb-3">
            <label className="form-label d-block">Select Metrics to Display</label>
            <div className="btn-group mb-2" role="group">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={selectAllMetrics}
              >
                Select All
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={deselectAllMetrics}
              >
                Deselect All
              </button>
            </div>
            <div className="row">
              {AVAILABLE_METRICS.map(metric => (
                <div className="col-md-6 col-lg-4" key={metric.id}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`metric-${metric.id}`}
                      checked={selectedMetrics.includes(metric.id)}
                      onChange={() => toggleMetric(metric.id)}
                    />
                    <label className="form-check-label" htmlFor={`metric-${metric.id}`}>
                      {metric.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refresh Button */}
          <button
            className="btn btn-primary"
            onClick={loadAnalyticsData}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Summary Statistics Cards */}
      {analyticsData?.summary && (
        <div className="row mb-4">
          {selectedMetrics.includes('total_guests') && (
            <div className="col-md-3 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Total Guests</h5>
                  <p className="display-6">{analyticsData.summary.total_guests || 0}</p>
                </div>
              </div>
            </div>
          )}
          
          {selectedMetrics.includes('guests_with_lessons') && (
            <div className="col-md-3 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">With Lessons</h5>
                  <p className="display-6">{analyticsData.summary.guests_with_lessons || 0}</p>
                </div>
              </div>
            </div>
          )}
          
          {selectedMetrics.includes('guests_without_lessons') && (
            <div className="col-md-3 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Without Lessons</h5>
                  <p className="display-6">{analyticsData.summary.guests_without_lessons || 0}</p>
                </div>
              </div>
            </div>
          )}
          
          {analyticsData.summary.average_lessons_per_guest !== undefined && (
            <div className="col-md-3 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Avg Lessons</h5>
                  <p className="display-6">
                    {analyticsData.summary.average_lessons_per_guest.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Row 1: Age Groups and Lesson Types */}
      <div className="row mb-4">
        {selectedMetrics.includes('age_groups') && ageGroupChartData && (
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Guest Distribution by Age Group</h5>
                <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Pie data={ageGroupChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedMetrics.includes('lesson_types') && lessonTypesChartData && (
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Lesson Types Distribution</h5>
                <Bar data={lessonTypesChartData} options={barChartOptions} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Row 2: Skill Levels */}
      {selectedMetrics.includes('skill_levels') && skillLevelChartData && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Skill Level Distribution</h5>
            <Bar data={skillLevelChartData} options={barChartOptions} />
          </div>
        </div>
      )}

      {/* Time Series Chart */}
      {timeSeriesChartData && timeSeriesChartData.datasets.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Trends Over Time ({interval.charAt(0).toUpperCase() + interval.slice(1)})</h5>
            <Line data={timeSeriesChartData} options={barChartOptions} />
          </div>
        </div>
      )}

      {/* Additional Data Tables */}
      {analyticsData?.summary?.lesson_distribution && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Lesson Distribution</h5>
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Number of Lessons</th>
                  <th>Number of Guests</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analyticsData.summary.lesson_distribution)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([lessons, count]) => (
                    <tr key={lessons}>
                      <td>{lessons}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
