import React, {useState, useEffect} from "react";
import DatePicker from "../components/datepicker/DatePicker";
import axios from "axios";
import * as XLSX from "xlsx";
import "../components/guestList/guestList.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const KidsList = () => {
    const [selectedDate, setSelectedDate] = useState("2025-06-01");
    const [guests, setGuests] = useState([]);
    const [adults, setAdults] = useState([]);
    const [kids, setKids] = useState([]);
    const [summary, setSummary] = useState({});
    const [upcomingWeek, setUpcomingWeek] = useState({upcoming_week:[]});

    useEffect(() => {
        const loadUpcomingWeek = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/upcomingweek?date=${selectedDate}`);
                setUpcomingWeek(res.data || {upcoming_week:[]});
                console.log(res.data);
            } catch (err) {
                console.error("Error loading guest data", err);
            }
        }
        loadUpcomingWeek();
        const loadGuests = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/bookings?date=${selectedDate}`);
                setKids(res.data);


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

        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const dayNamesRow = {};
        const datesRow = {};
        const totalsRow = {};

        weekdays.forEach(day => {
            const info = upcomingWeek.upcoming_week[day] || {};
            dayNamesRow[day] = day;
            datesRow[day] = info.date || "";
            totalsRow[day] = info.total_amount ?? 0;
        });

        const sheetData = [dayNamesRow, datesRow, totalsRow];

        const ws = XLSX.utils.json_to_sheet(sheetData, { skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws, "Next Weeks Totals");

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
                    <th>Arrival</th>
                    <th>Departure</th>
                    <th>Age Group</th>
                    <th>Booked Surflessons</th>
                </tr>
                </thead>
                <tbody>
                {data.map((g, index) => (
                    <tr key={index}>
                        <td>{g.first_name}</td>
                        <td>{g.last_name}</td>
                        <td><span className="badge bg-primary-subtle">{g.tent}</span></td>
                        <td>{g.arrival}</td>
                        <td>{g.departure}</td>
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
                    <DatePicker selectedDate={selectedDate} onChange={setSelectedDate}/>
                    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={exportToExcel}>Export to Excel
                    </button>
                </div>
            </div>

            {renderTable(kids, "Kids")}

        </div>
    );
};

export default KidsList;
