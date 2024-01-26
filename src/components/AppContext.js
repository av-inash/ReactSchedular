// AppContext.js
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [timeSlots, setTimeSlots] = useState(Array(7).fill().map(() => Array(24).fill(false)));

    const toggleTimeSlot = (dayIndex, hourIndex) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[dayIndex][hourIndex] = !newTimeSlots[dayIndex][hourIndex];
        setTimeSlots(newTimeSlots);
    };

    return (
        <AppContext.Provider value={{ timeSlots, toggleTimeSlot }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
