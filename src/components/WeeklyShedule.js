// src/components/WeeklySchedule.js
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const WeeklySchedule = ({ selectedDate, selectedTimezone, setSelectedDate }) => {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const startDate = moment(selectedDate).startOf('week');
        const endDate = moment(startDate).endOf('week');
        const newSchedule = [];
        let currentDate = startDate;

        while (currentDate.isSameOrBefore(endDate)) {
            const dayOfWeek = currentDate.day();
            const isPast = currentDate.isBefore(moment().startOf('day'));

            const startTime = moment(currentDate).set({ hour: 8, minute: 0 });
            const endTime = moment(currentDate).set({ hour: 23, minute: 0 });

            const timeSlots = [];
            while (startTime.isBefore(endTime)) {
                timeSlots.push({
                    startTime: startTime.clone(),
                    endTime: startTime.clone().add(30, 'minutes'),
                    checked: false,
                });
                startTime.add(30, 'minutes');
            }

            newSchedule.push({
                date: currentDate.format('YYYY-MM-DD'),
                dayOfWeek: currentDate.format('dddd'),
                timeSlots,
                isPast,
            });
            currentDate = currentDate.clone().add(1, 'day');
        }

        setSchedule(newSchedule);
    }, [selectedDate, selectedTimezone]);

    const handleWeekChange = (direction) => {
        const newDate = moment(selectedDate).add(direction, 'week');
        setSelectedDate(newDate.toDate());
    };

    const handleCheckboxChange = (dayIndex, timeIndex) => {
        const updatedSchedule = [...schedule];
        updatedSchedule[dayIndex].timeSlots[timeIndex].checked = !updatedSchedule[dayIndex].timeSlots[timeIndex].checked;
        setSchedule(updatedSchedule);
    };

    return (
        <div>
            <div>
                <button onClick={() => handleWeekChange(-1)}>Previous Week</button>
            </div>
            <div>
                {schedule.map((day, dayIndex) => (
                    <div key={dayIndex}>
                        <h3>{day.date} ({day.dayOfWeek})</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {day.timeSlots.map((timeSlot, timeIndex) => (
                                <div key={timeIndex} style={{ marginRight: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <span>{timeSlot.startTime.format('HH:mm')} - {timeSlot.endTime.format('HH:mm')}</span>
                                    <input
                                        type="checkbox"
                                        checked={timeSlot.checked}
                                        onChange={() => handleCheckboxChange(dayIndex, timeIndex)}
                                        disabled={day.isPast}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => handleWeekChange(1)}>Next Week</button>
            </div>
        </div>
    );
};

export default WeeklySchedule;
