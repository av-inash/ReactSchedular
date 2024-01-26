// TimezoneSelector.js
import React from 'react';

const TimezoneSelector = ({ selectedTimezone, handleTimezoneChange }) => {
    return (
        <select value={selectedTimezone} onChange={handleTimezoneChange}>
            <option value="UTC+0">UTC+0</option>
            <option value="UTC+X">UTC+X</option> {/* Replace X with the offset you want */}
        </select>
    );
};

export default TimezoneSelector;
