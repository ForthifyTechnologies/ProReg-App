import moment from "moment";
import { Text, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";
import useTimetable from "../../hooks/useTimetable";
import * as Haptics from "expo-haptics";

export default function Timetable({
  onSchedulePressed,
}: {
  onSchedulePressed: (schedule: Schedule) => void;
}) {
  const { timetable } = useTimetable();

  let startTime = 24;
  let events: any = [[], [], [], [], [], [], []];

  for (const [index, schedule] of (timetable?.schedules || []).entries()) {
    for (let weekTime of schedule.weekTimes) {
      // Turn start and end times into integer
      // Example: 10:30 -> 10.5
      let start =
        parseInt(weekTime.start.split(":")[0]) +
        parseInt(weekTime.start.split(":")[1]) / 60;
      let end =
        parseInt(weekTime.end.split(":")[0]) +
        parseInt(weekTime.end.split(":")[1]) / 60;

      // If start time is smaller than previous start time, update start time
      if (start < startTime) startTime = start;

      // Push
      events[weekTime.day].push({
        schedule,
        index,
        weekTime,
        start,
        end,
      });
    }
  }

  // Remove weekends if there are no events on weekends
  if (events[0].length === 0 && events[6].length === 0)
    events = events.slice(1, 6);

  // TODO: Fix timetable padding
  // TODO: Improve bottom bar design and code
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* Map each column resembling the days of the week */}
      {events.map((dayEvents: any, index: number) => (
        <View
          key={index}
          style={{
            position: "relative",
            flex: 1,
            marginLeft: index !== 0 ? 6 : 0,
            backgroundColor: "red",
          }}
        >
          {/* Display days of the week */}
          <Text
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: 12,
              width: "100%",
              textAlign: "center",
              color: colors.zinc[400],
            }}
          >
            {moment()
              .day(events.length === 5 ? index + 1 : index)
              .format(events.length === 5 ? "ddd" : "dd")}
          </Text>

          {/* Map each event in the column */}
          {dayEvents.map((event: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={{
                position: "absolute",
                // 84 is the height of each hour
                // 3 is the margin
                // 32 is the height of the day text
                top: (event.start - startTime) * 84 + 3 + 32,
                // 6 is the margin
                height: (event.end - event.start) * 84 - 6,
                width: "100%",
                borderRadius: 8,
                // @ts-ignore
                backgroundColor: colors[event.schedule.color][300] + "33",
                padding: 4,
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                // TODO: Show info only instead of edit form
                onSchedulePressed(event.schedule);
              }}
              onLongPress={() => {
                Haptics.impactAsync();
                onSchedulePressed(event.schedule);
              }}
            >
              <Text
                style={{
                  // @ts-ignore
                  color: colors[event.schedule.color || "lime"][300] + "cc",
                  width: "100%",
                  textAlign: "left",
                  fontSize: 10,
                }}
              >
                {moment(event.weekTime.start, "HH:mm").format("h:mm A")}
              </Text>
              <Text
                style={{
                  // @ts-ignore
                  color: colors[event.schedule.color || "lime"][300],
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {event.schedule.abbreviation || event.schedule.title}
              </Text>
              <Text
                style={{
                  // @ts-ignore
                  color: colors[event.schedule.color][300] + "cc",
                  width: "100%",
                  textAlign: "right",
                  fontSize: 10,
                }}
              >
                {moment(event.weekTime.end, "HH:mm").format("h:mm A")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}
