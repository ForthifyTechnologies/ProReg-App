import AsyncStorage from "@react-native-async-storage/async-storage";
import generateRandomString from "../../utils/strings/generateRandomString";

// Get all timetables
export async function getTimetables(): Promise<Timetable[]> {
  return JSON.parse((await AsyncStorage.getItem("@timetables")) || "[]");
}

// Add a new timetable
export async function addTimetable(timetable: Timetable): Promise<Timetable> {
  const timetables = await getTimetables();
  timetables.push({ _id: generateRandomString(4), ...timetable });
  await AsyncStorage.setItem("@timetables", JSON.stringify(timetables));
  return timetable;
}

// Update an existing timetable
export async function updateTimetable(
  timetable: Timetable
): Promise<Timetable> {
  let timetables = await getTimetables();
  timetables = timetables.map((t) => {
    if (t._id === timetable._id) {
      return timetable;
    }
    return t;
  });
  await AsyncStorage.setItem("@timetables", JSON.stringify(timetables));
  return timetable;
}

// Delete an existing timetable
export async function deleteTimetable(timetable: Timetable): Promise<void> {
  let timetables = await getTimetables();
  timetables = timetables.filter((t) => t._id !== timetable._id);
  await AsyncStorage.setItem("@timetables", JSON.stringify(timetables));
}
