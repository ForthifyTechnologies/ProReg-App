"use client";

import { createContext, useContext, useState } from "react";

/**
 * Context creation
 */

// Define the type of the context value
interface TimetableContextValue {
  timetable: Timetable | undefined;
  setTimetable: (newTimetable: Timetable) => void;
}

// Create the context with the type
export const TimetableContext = createContext<
  TimetableContextValue | undefined
>(undefined);

// Create a custom hook to access the context
export function useTimetableContext() {
  const context = useContext(TimetableContext);
  // Throw an error if the context is undefined
  if (!context) {
    throw new Error(
      "useTimetableContext must be used within a TimetableContextProvider"
    );
  }
  return context;
}

/**
 * Component creation
 */

interface TimetableContextProviderProps {
  children?: React.ReactNode;
}

export default function TimetableContextProvider({
  children,
}: TimetableContextProviderProps) {
  // Initialize the state with a default value
  const [timetable, setTimetable] = useState<Timetable | undefined>(undefined);

  return (
    <TimetableContext.Provider value={{ timetable, setTimetable }}>
      {children}
    </TimetableContext.Provider>
  );
}
