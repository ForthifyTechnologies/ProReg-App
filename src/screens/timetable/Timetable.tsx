import moment from "moment";
import { Text, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";
import useTimetable from "../../hooks/useTimetable";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

export default function Timetable({
  onSchedulePressed,
}: {
  onSchedulePressed: (schedule: Schedule) => void;
}) {
  const { timetable } = useTimetable();

  let startTime = 24,
    endTime = 0;
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
      // Vice versa for end time
      if (end > endTime) endTime = end;

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
        // Calculate height based on the start and end times
        height: (endTime - startTime) * 84,
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
          }}
        >
          {/* Display days of the week */}
          <View
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              overflow: "hidden",
              borderRadius: 8,
            }}
          >
            <BlurView
              style={{
                paddingVertical: 2,
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  width: "100%",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {moment()
                  .day(events.length === 5 ? index + 1 : index)
                  .format(events.length === 5 ? "ddd" : "dd")}
              </Text>
            </BlurView>
          </View>

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
                width: "100%",
                // 6 is the margin
                height: (event.end - event.start) * 84 - 6,
                borderRadius: 8,
                overflow: "hidden",
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
              <BlurView
                intensity={16}
                style={{
                  width: "100%",
                  height: "100%",
                  // @ts-ignore
                  backgroundColor: colors[event.schedule.color][300] + "80",
                  padding: 4,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    // @ts-ignore
                    color: "white",
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
                    color: "white",
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
                    color: "white",
                    width: "100%",
                    textAlign: "right",
                    fontSize: 10,
                  }}
                >
                  {moment(event.weekTime.end, "HH:mm").format("h:mm A")}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}
