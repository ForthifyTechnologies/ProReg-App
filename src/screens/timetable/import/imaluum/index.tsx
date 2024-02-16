import HeaderButton from "@/components/header/button";
import List from "@/components/list";
import { useImaluumSessionStore } from "@/contexts/imaluumSessionStore";
import { addTimetable } from "@/database/controllers/timetable";
import { styles } from "@/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import colors from "tailwindcss/colors";

const url = "https://proreg.forthify.tech";

export default function ImportFromImaluumScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const existingTitles: string[] = route.params.existingTitles;

  const { imaluumSession, setImaluumSession } = useImaluumSessionStore();

  // Data
  const [tempTimetable, setTempTimetable] = useState<Timetable | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState<any | null>(null);

  useEffect(() => {
    // Setup header buttons
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton title="Cancel" onPress={navigation.goBack} />
      ),
      headerRight: () => (
        <HeaderButton
          title="Save"
          bold
          disabled={timetables.length === 0}
          onPress={save}
        />
      ),
    });
  }, [navigation, timetables]);

  async function importTimetable() {
    setLoading(true);
    setTempTimetable(null);

    const username = imaluumSession.username;
    const password = imaluumSession.password;

    console.log("username", username, "password", password);

    try {
      console.log(`${url}/api/timetables/import/imaluum`);
      const response = await axios.post(
        `${url}/api/timetables/import/imaluum`,
        {
          username,
          password,
        }
      );

      console.log("response", response.data.timetable);

      const timetable: Timetable = response.data.timetable;
      const sessions = response.data.sessions;

      setTempTimetable(timetable);
      setSessions(sessions);
    } catch (error: any) {
      if (error.response.status === 401) {
        Alert.alert(
          "Invalid Credentials",
          "Please check your username and password."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function importSession(session: any) {
    if (!tempTimetable) return;

    const username = imaluumSession.username;
    const password = imaluumSession.password;
    // If session refers to tempTimetable, just copy

    if (
      session.year === tempTimetable.year &&
      session.semester === tempTimetable.semester
    ) {
      setTimetables([...timetables, tempTimetable]);
      return;
    }

    // Else, import timetable as usual

    setLoadingSession(session);

    const response = await axios.post(`${url}/api/timetables/import/imaluum`, {
      username,
      password,
      year: session.year,
      semester: session.semester,
    });

    const timetable: Timetable = response.data.timetable;
    setTimetables([...timetables, timetable]);

    setLoadingSession(null);
  }

  async function save() {
    if (timetables.length === 0) return;

    for (const timetable of timetables) {
      const tweakedTimetable = { ...timetable };

      const colors = [
        "slate",
        "red",
        "orange",
        "yellow",
        "lime",
        "emerald",
        "sky",
        "indigo",
        "violet",
        "pink",
      ];

      // Set color and abbreviation for every schedule in timetable
      tweakedTimetable.schedules = tweakedTimetable.schedules.map(
        (schedule) => {
          return {
            ...schedule,
            color: colors[Math.floor(Math.random() * colors.length)],
            abbreviation: schedule.title
              .split(" ")
              .map((x) => x[0])
              .join(""),
          };
        }
      );

      // Rename title if it already exists
      // Append (2), (3), etc. to the title
      let index = 2;
      let title = timetable.title;
      while (existingTitles.includes(title)) {
        title = `${timetable.title} (${index})`;
        index++;
      }
      tweakedTimetable.title = title;

      // Add timetable to database
      await addTimetable(tweakedTimetable);
    }

    navigation.goBack();
    // Delay navigation to help trigger the reload of
    // the timetable list in the home screen
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.zinc[900] }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* i-Ma'luum Credentials */}
      <List
        lighter
        title="Credentials"
        footer="Your username and password will not be stored."
      >
        <List.TextInput
          title="Username or Matric No."
          value={imaluumSession.username}
          onChangeText={(e) =>
            setImaluumSession({
              username: e,
              password: imaluumSession.password,
            })
          }
          disabled={loading}
        />
        <List.TextInput
          title="Password"
          value={imaluumSession.password}
          onChangeText={(e) =>
            setImaluumSession({
              username: imaluumSession.username,
              password: e,
            })
          }
          secureTextEntry
          disabled={loading}
        />
        <List.Button
          title="Authenticate"
          onPress={importTimetable}
          color={colors.lime[500]}
          loading={loading}
          disabled={
            imaluumSession.username === "" ||
            imaluumSession.password === "" ||
            loading
          }
        />
      </List>

      {/* Sessions */}
      {tempTimetable && (
        <List title={`Found ${sessions.length} Sessions`} lighter>
          {sessions.map((session, index) => {
            const imported = timetables.some(
              (timetable) =>
                timetable.year === session.year &&
                timetable.semester === session.semester
            );

            return (
              <List.Button
                key={index}
                title={`Sem ${session.semester} (${session.year})`}
                loading={
                  loadingSession &&
                  loadingSession.year === session.year &&
                  loadingSession.semester === session.semester
                }
                disabled={loadingSession || imported}
                value={imported ? "Imported" : undefined}
                onPress={() =>
                  Alert.alert(
                    "Import Session",
                    `Are you sure you want to import the timetable for Semester ${session.semester} (${session.year})?`,
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Import",
                        onPress: () => importSession(session),
                      },
                    ]
                  )
                }
              />
            );
          })}
        </List>
      )}
    </ScrollView>
  );
}
