import React, { useState, useEffect } from "react";
import DatePicker from "../components/datepicker/DatePicker";
import axios from "axios";
import * as XLSX from "xlsx";
import "../components/guestList/guestList.css";

//const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const GuestList = () => {
  const [selectedDate, setSelectedDate] = useState("2025-06-01");
  const [guests, setGuests] = useState([]);
  const [adults, setAdults] = useState([]);
  const [kids, setKids] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const loadGuests = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/bookings?date=${selectedDate}`);
        const guestsData = res.data || [];

        const adultsList = [];
        const kidsList = [];
        const groupCounts = {};
        let kidsCount = 0;

        guestsData.forEach((g) => {
          const isAdult = g.group === "Adults >18 years" || !g.group;

          if (isAdult) {
            adultsList.push(g);
            const key = g.notes_one?.trim() || g.diet?.trim() || "Anything";
            if (!groupCounts[key]) {
              groupCounts[key] = { count: 0, tents: new Set() };
            }
            groupCounts[key].count += 1;
            if (g.tent) groupCounts[key].tents.add(g.tent);
          } else {
            kidsList.push(g);
            kidsCount += 1;
          }
        });

        // Flatten tents into strings
        const flattened = {};
        for (const key in groupCounts) {
          flattened[key] = {
            count: groupCounts[key].count,
            tents: Array.from(groupCounts[key].tents).join(", "),
          };
        }

        // Add kids count to summary
        flattened["Kids Buns Only"] = { count: kidsCount, tents: "" };

        setGuests(guestsData);
        setAdults(adultsList);
        setKids(kidsList);
        setSummary(flattened);
      } catch (err) {
        console.error("Error loading guest data", err);
      }
    };
    loadGuests();
  }, [selectedDate]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const createSheet = (data, name) => {
      const sheetData = data.map((g) => ({
        FirstName: g.first_name,
        LastName: g.last_name,
        Tent: g.tent,
        Diet: g.diet,
        Notes: g.notes_one,
        Group: g.group,
      }));
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };

    createSheet(adults, "Adults");
    createSheet(kids, "Kids");

    const summarySheet = Object.entries(summary).map(([key, value]) => ({
      Group: key,
      Count: value.count,
      Tents: value.tents,
    }));
    const wsSummary = XLSX.utils.json_to_sheet(summarySheet);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    XLSX.writeFile(wb, `GuestList_${selectedDate}.xlsx`);
  };

  const renderTable = (data, title) => (
      <>
        <h2 className="mt-4">{title}</h2>
        <table className="table table-sm table-striped table-bordered">
          <thead className="table-light">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Tent</th>
            <th>Diet</th>
            <th>Notes</th>
            <th>Age Group</th>
          </tr>
          </thead>
          <tbody>
          {data.map((g, index) => (
              <tr key={index}>
                <td>{g.first_name}</td>
                <td>{g.last_name}</td>
                <td><span className="badge bg-primary-subtle">{g.tent}</span></td>
                <td>{g.diet}</td>
                <td>{g.notes_one}</td>
                <td>{g.group}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </>
  );

  return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-bg-info">Guests for <span className="text-secondary">{selectedDate}</span></h5>
          <div>
            <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            <button className="btn btn-outline-secondary btn-sm ms-2" onClick={exportToExcel}>Export to Excel</button>
          </div>
        </div>

        {renderTable(adults, "Adults")}
        {renderTable(kids, "Kids")}

        <div className="mt-4">
          <h2>Diet/Notes Summary</h2>
          <table className="table table-sm table-bordered">
            <thead className="table-light">
            <tr>
              <th>Diet</th>
              <th>Count</th>
              <th>Tents</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(summary).map(([group, info]) => (
                <tr key={group}>
                  <td>{group}</td>
                  <td>{info.count}</td>
                  <td>
                    {info.tents.split(', ').map((tent, idx) => (
                        <span key={idx} className="badge bg-primary-subtle me-1">{tent}</span>
                    ))}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default GuestList;
