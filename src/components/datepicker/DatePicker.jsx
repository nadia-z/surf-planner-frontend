// components/DatePicker.js
import React from "react";

const DatePicker = ({ selectedDate, onChange }) => {
    return (
        <input
            type="date"
            value={selectedDate}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default DatePicker;
