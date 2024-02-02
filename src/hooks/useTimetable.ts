import { useMemo } from "react";
import { useTimetableContext } from "../contexts/timetable";
import {
  updateTimetable,
  deleteTimetable,
} from "../database/controllers/timetable";

export default function useTimetable() {
  const { timetable, setTimetable } = useTimetableContext();

  function addSchedule(schedule: Schedule): void {
    if (!timetable) return;

    const newTimetable = { ...timetable };
    newTimetable.schedules.push(schedule);
    setTimetable(newTimetable);
    updateTimetable(newTimetable);
  }

  function updateSchedule(index: number, schedule: Schedule): void {
    if (!timetable) return;

    const newTimetable = { ...timetable };
    newTimetable.schedules[index] = schedule;
    setTimetable(newTimetable);
    updateTimetable(newTimetable);
  }

  function deleteSchedule(index: number): void {
    if (!timetable) return;

    const newTimetable = { ...timetable };
    newTimetable.schedules = timetable.schedules.filter((_, i) => i !== index);
    setTimetable(newTimetable);
    updateTimetable(newTimetable);
  }

  function clearSchedules(): void {
    if (!timetable) return;

    const newTimetable = { ...timetable };
    newTimetable.schedules = [];
    setTimetable(newTimetable);
    updateTimetable(newTimetable);
  }

  function updateTimetableDetails({
    title,
    university,
    semester,
    year,
  }: {
    title?: string;
    university?: string;
    semester?: number;
    year?: string;
  }) {
    if (!timetable) return;

    const newTimetable = { ...timetable };
    if (title) newTimetable.title = title;
    if (university) newTimetable.university = university;
    if (semester) newTimetable.semester = semester;
    if (year) newTimetable.year = year;
    setTimetable(newTimetable);
    updateTimetable(newTimetable);
  }

  function deleteTimetableContext() {
    if (!timetable) return;

    deleteTimetable(timetable);
  }

  return {
    timetable,
    setTimetable,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    clearSchedules,
    updateTimetableDetails,
    deleteTimetable: deleteTimetableContext,
  };
}
