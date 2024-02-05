import { ScrollView } from "react-native";
import { styles } from "../../styles";
import List from "../../components/list";
import BottomBar from "../../components/bottomBar";
import { useEffect, useState } from "react";
import { getTimetables } from "../../database/controllers/timetable";
import useTimetable from "../../hooks/useTimetable";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const { setTimetable } = useTimetable();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadTimetables();
    });

    return unsubscribe;
  }, [navigation]);

  async function loadTimetables() {
    setTimetables(await getTimetables());
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 128 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <List title="My Timetables">
          {timetables.map((timetable, index) => (
            <List.Button
              key={index}
              title={timetable.title}
              onPress={() => {
                setTimetable(timetable);
                navigation.navigate("Timetable");
              }}
            />
          ))}
        </List>
      </ScrollView>
      <BottomBar>
        <BottomBar.Button
          icon="add-circle"
          onPress={() =>
            navigation.navigate("New Timetable", {
              existingTitles: timetables.map((timetable) => timetable.title),
            })
          }
        >
          New Timetable
        </BottomBar.Button>
      </BottomBar>
    </>
  );
}
