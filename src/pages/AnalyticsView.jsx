import React, { useState, useEffect, useCallback } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import {
  fetchAgeGroupStatistics,
  fetchSurfLessonStatistics,
  fetchSkillLevelDistribution,
  fetchMonthlyStatistics
} from "../api/analyticsApi";
import "./AnalyticsView.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalyticsView = () => {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Statistics data
  const [ageGroupData, setAgeGroupData] = useState(null);
  const [surfLessonData, setSurfLessonData] = useState(null);
  const [skillLevelData, setSkillLevelData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);

  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ageGroups, surfLessons, skillLevels] = await Promise.all([
        fetchAgeGroupStatistics(startDate, endDate),
        fetchSurfLessonStatistics(startDate, endDate),
        fetchSkillLevelDistribution(startDate, endDate)
      ]);
      setAgeGroupData(ageGroups);
      setSurfLessonData(surfLessons);
      setSkillLevelData(skillLevels);
    } catch (err) {
      setError("Failed to load analytics data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const loadMonthlyData = useCallback(async () => {
    try {
      const monthly = await fetchMonthlyStatistics(selectedYear);
      setMonthlyData(monthly);
    } catch (err) {
      console.error("Failed to load monthly data:", err);
    }
  }, [selectedYear]);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Load monthly data when year changes
  useEffect(() => {
    loadMonthlyData();
  }, [loadMonthlyData]);

  // Prepare chart data for age groups (Pie Chart)
  const ageGroupChartData = ageGroupData ? {
    labels: ["Adults", "Teens", "Kids"],
    datasets: [{
      data: [
        ageGroupData.adults || 0,
        ageGroupData.teens || 0,
        ageGroupData.kids || 0
      ],
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
  } : null;

  // Prepare chart data for skill levels (Bar Chart)
  const skillLevelChartData = skillLevelData ? {
    labels: Object.keys(skillLevelData).filter(key => key !== 'total_students'),
    datasets: [{
      label: "Number of Students",
      data: Object.entries(skillLevelData)
        .filter(([key]) => key !== 'total_students')
        .map(([, value]) => value),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1
    }]
  } : null;

  // Prepare chart data for monthly overview (Bar Chart)
  const monthlyChartData = monthlyData ? {
    labels: Object.keys(monthlyData).map(month => month.charAt(0).toUpperCase() + month.slice(1)),
    datasets: [
      {
        label: "Total Guests",
        data: Object.values(monthlyData).map(m => m.total_guests || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      },
      {
        label: "Total Lessons",
        data: Object.values(monthlyData).map(m => m.total_lessons || 0),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1
      }
    ]
  } : null;

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

  // Generate year options (from 2020 to current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => 2020 + i);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Analytics Dashboard</h1>

      {/* Date Range Selection */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Date Range</h5>
          <div className="row">
            <div className="col-md-5">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={loadAnalyticsData}
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

      {/* Statistics Cards */}
      {surfLessonData && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Guests</h5>
                <p className="display-6">{surfLessonData.total_guests || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">With Lessons</h5>
                <p className="display-6">{surfLessonData.guests_with_lessons || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Without Lessons</h5>
                <p className="display-6">{surfLessonData.guests_without_lessons || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Avg Lessons</h5>
                <p className="display-6">
                  {surfLessonData.average_lessons_per_guest 
                    ? surfLessonData.average_lessons_per_guest.toFixed(1) 
                    : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1: Age Groups and Skill Levels */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Guest Distribution by Age Group</h5>
              {ageGroupChartData ? (
                <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Pie data={ageGroupChartData} options={chartOptions} />
                </div>
              ) : (
                <p className="text-center">Loading...</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Skill Level Distribution</h5>
              {skillLevelChartData ? (
                <Bar data={skillLevelChartData} options={barChartOptions} />
              ) : (
                <p className="text-center">Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Monthly Overview for {selectedYear}</h5>
            <select
              className="form-select w-auto"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {monthlyChartData ? (
            <Bar data={monthlyChartData} options={barChartOptions} />
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </div>
      </div>

      {/* Surf Lesson Distribution */}
      {surfLessonData && surfLessonData.lesson_distribution && (
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
                {Object.entries(surfLessonData.lesson_distribution)
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
