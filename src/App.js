// src/App.js
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppContext } from './components/AppContext';
import data from './utils/data.json'; // Import the JSON data

import React, { useState } from 'react';
import './App.css';

function App() {
  // const { timeSlots, toggleTimeSlot } = useAppContext(); // Remove this line

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC');
  const [timeSlotsState, setTimeSlotsState] = useState(Array(7).fill().map(() => Array(24).fill(false)));

  const handlePreviousWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    resetTimeSlots();
  };

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    resetTimeSlots();
  };

  const resetTimeSlots = () => {
    const newTimeSlots = Array(7).fill().map(() => Array(24).fill(false));
    setTimeSlotsState(newTimeSlots);
  };

  const handleTimeSlotToggle = (dayIndex, hourIndex) => {
    const newTimeSlots = [...timeSlotsState];
    newTimeSlots[dayIndex][hourIndex] = !newTimeSlots[dayIndex][hourIndex];
    setTimeSlotsState(newTimeSlots);
  };

  const renderDays = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = currentDate.getDay();

    return days.map((day, index) => (
      <div className="wek" key={index}>
        <div className="day">
          {days[(currentDay + index) % 7]} <br />
          {formatDate(currentDate, index)}
        </div>
        <div className="daytime">
          {renderTimeSlots(index)}
        </div>
      </div>
    ));
  };

  const renderTimeSlots = (dayIndex) => {
    const startTime = 8; // Start time (in 24-hour format)
    const timeSlotCount = 24; // Total number of time slots
    const timeSlotInterval = 0.5; // Time interval in hours

    // Filter data based on the current date
    const dayData = data.filter(item => formatDate(currentDate, dayIndex) === item.Date);

    return Array.from({ length: timeSlotCount }, (_, index) => {
      const hour = startTime + Math.floor(index * timeSlotInterval);
      const minutes = (index % 2) * 30;

      // Check if there is an entry in the data for the current hour
      const matchingEntry = dayData.find(item => {
        const entryHour = parseInt(item.Time.split(':')[0]);
        const entryMinutes = parseInt(item.Time.split(':')[1]);
        return entryHour === hour && entryMinutes === minutes;
      });

      console.log(`Checking hour: ${hour}:${minutes}, Matching Entry: `, matchingEntry);

      return (
        <div key={index}>
          <label className={timeSlotsState[dayIndex][index] ? 'checked' : ''}>
            <input
              type="checkbox"
              checked={timeSlotsState[dayIndex][index]}
              onChange={() => handleTimeSlotToggle(dayIndex, index)}
            />
            {`${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}
          </label>
        </div>
      );
    });
  };

  const formatDate = (date, offset) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + offset);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}`;
  };

  return (
    <div className="container">
      <div className="heading">
        <button onClick={handlePreviousWeek}>Previous week</button>
        <DatePicker
          selected={currentDate}
          onChange={(date) => setCurrentDate(date)}
          dateFormat="MMMM d, yyyy"
          selectsStart
          startDate={currentDate}
          endDate={new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000)} // One week later
        />
        <button onClick={handleNextWeek}>Next week</button>
      </div>
      <div className="timezone">
        <label htmlFor="timezone">Time Zone:</label>
        <select
          id="timezone"
          name="timezone"
          value={selectedTimeZone}
          onChange={(e) => setSelectedTimeZone(e.target.value)}
        >
          <option value="UTC">Coordinated Universal Time (UTC)</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
        </select>
      </div>
      <div className="week">
        {renderDays()}
      </div>
    </div>
  );
}

export default App;
