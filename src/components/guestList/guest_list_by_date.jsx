import React, { useState, useEffect } from "react";
import DatePicker from "../datepicker/DatePicker";
import axios from "axios";
import "./guestList.css";

const API_BASE_URL = "http://localhost:8000"; // Update if needed

const GuestListByDate = () => {
    const [selectedDate, setSelectedDate] = useState("2025-06-01");
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/bookings?date=${selectedDate}`);
                setGuests(response.data || []);
                setError(null);
            } catch (err) {
                setGuests([]);
                setError("Failed to load guests.");
            } finally {
                setLoading(false);
            }
        };

        fetchGuests();
    }, [selectedDate]);

    return (
        <div className="guestlist-container">
            <div className="guestlist-header">
                <h2>Guests for {selectedDate}</h2>
                <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : guests.length === 0 ? (
                <p>No guests found.</p>
            ) : (
                <table className="guestlist-table">
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Diet</th>
                    </tr>
                    </thead>
                    <tbody>
                    {guests.map((guest, index) => (
                        <tr key={index}>
                            <td>{guest.guest_first_name}</td>
                            <td>{guest.guest_last_name}</td>
                            <td>{guest.guest_diet || "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GuestListByDate;
