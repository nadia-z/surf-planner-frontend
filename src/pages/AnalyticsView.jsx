import React, { useState, useEffect, useCallback } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "./AnalyticsView.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const METRIC_OPTIONS = [
  { key: 'total_guests', label: 'Total Guests' },
  { key: 'adults', label: 'Adults' },
  { key: 'teens', label: 'Teens' },
  { key: 'kids', label: 'Kids' },
  { key: 'surf_lessons', label: 'Surf Lessons' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'beginner_plus', label: 'Beginner Plus' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
  { key: 'teen_students', label: 'Teen Students' },
  { key: 'kid_students', label: 'Kid Students' },
  // Add more metrics as needed
];

const INTERVAL_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

// Color palette for datasets
const COLORS = [
  "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)",
  "rgba(255, 99, 132, 0.6)", "rgba(75, 192, 192, 0.6)",
  "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)",
  "rgba(100, 255, 218, 0.6)", "rgba(200, 200, 54, 0.6)",
  "rgba(255, 118, 132, 0.6)", "rgba(175, 192, 192, 0.6)",
  "rgba(170, 102, 255, 0.6)", "rgba(155, 159, 64, 0.6)"
];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const fetchFlexibleAnalytics = async (startDate, endDate, interval, metrics) => {
  const params = {
    start_date: startDate,
    end_date: endDate,
    period: interval,
    filters: metrics,
  };
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/flexible`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch flexible analytics:", error);
    throw error;
  }
};

const AnalyticsView = () => {
  // Date range and interval state
  const [startDate, setStartDate] = useState("2025-08-01");
  const [endDate, setEndDate] = useState("2025-08-31");
  const [interval, setInterval] = useState("weekly");
  const [selectedMetrics, setSelectedMetrics] = useState(METRIC_OPTIONS.map(m => m.key));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch analytics data
  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFlexibleAnalytics(startDate, endDate, interval, selectedMetrics);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError("Failed to load analytics data. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, interval, selectedMetrics]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Chart data preparation
  const chartLabels = data.map(period =>
      `${period.period_start.slice(0, 10)} - ${period.period_end.slice(0, 10)}`
  );

  const chartDatasets = selectedMetrics.map((metric, idx) => ({
    label: METRIC_OPTIONS.find(m => m.key === metric)?.label || metric,
    data: data.map(period => period[metric] ?? 0),
    backgroundColor: COLORS[idx % COLORS.length],
  }));

  const chartData = {
    labels: chartLabels,
    datasets: chartDatasets,
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Analytics Overview" }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  // Metric selection UI
  const handleMetricChange = (metricKey) => {
    setSelectedMetrics(old =>
        old.includes(metricKey)
            ? old.filter(k => k !== metricKey)
            : [...old, metricKey]
    );
  };

  return (
      <div className="container mt-4">
        <h1 className="mb-4">Analytics Dashboard</h1>

        {/* Controls */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Controls</h5>
            <div className="row mb-2">
              <div className="col-md-3">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-control"
                       value={startDate}
                       onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Date</label>
                <input type="date" className="form-control"
                       value={endDate}
                       onChange={e => setEndDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Interval</label>
                <select className="form-select" value={interval}
                        onChange={e => setInterval(e.target.value)}>
                  {INTERVAL_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={loadAnalyticsData} disabled={loading}>
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">
                <label className="form-label">Metrics</label>
                <div className="d-flex flex-wrap">
                  {METRIC_OPTIONS.map(opt => (
                      <div key={opt.key} className="form-check me-3 mb-1">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedMetrics.includes(opt.key)}
                            onChange={() => handleMetricChange(opt.key)}
                            id={`metric-${opt.key}`}
                        />
                        <label className="form-check-label" htmlFor={`metric-${opt.key}`}>{opt.label}</label>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Chart */}
        <div className="card mb-4">
          <div className="card-body chart-container" style={{ height: "400px" }}>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <Bar data={chartData} options={barChartOptions} />
            )}
          </div>
        </div>

        {/* Raw Data Table (optional for debugging) */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Raw Data</h5>
            <table className="table table-sm table-striped">
              <thead>
              <tr>
                <th>Period</th>
                {selectedMetrics.map(m => (
                    <th key={m}>{METRIC_OPTIONS.find(opt => opt.key === m)?.label || m}</th>
                ))}
              </tr>
              </thead>
              <tbody>
              {data.map((period, idx) => (
                  <tr key={idx}>
                    <td>{chartLabels[idx]}</td>
                    {selectedMetrics.map(m => (
                        <td key={m}>{period[m] ?? 0}</td>
                    ))}
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default AnalyticsView;
