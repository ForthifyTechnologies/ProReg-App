import { Alert, ScrollView, Text } from "react-native";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import HeaderButton from "../../../../components/header/button";
import { styles } from "../../../../styles";
import List from "../../../../components/list";
import axios from "axios";
import { addTimetable } from "../../../../database/controllers/timetable";

export default function ImportFromImaluumScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  // Credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

    const response = await axios.post(
      "https://proreg.forthify.tech/api/timetables/import/imaluum",
      {
        username,
        password,
      }
    );

    // TODO: Show error if credentials are invalid

    const timetable: Timetable = response.data.timetable;
    const sessions = response.data.sessions;

    setTempTimetable(timetable);
    setSessions(sessions);

    setLoading(false);
  }

  async function importSession(session: any) {
    if (!tempTimetable) return;

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

    const response = await axios.post(
      "https://proreg.forthify.tech/api/timetables/import/imaluum",
      {
        username,
        password,
        year: session.year,
        semester: session.semester,
      }
    );

    const timetable: Timetable = response.data.timetable;
    setTimetables([...timetables, timetable]);

    setLoadingSession(null);
  }

  async function save() {
    if (timetables.length === 0) return;

    for (const timetable of timetables) {
      let tweakedTimetable = { ...timetable };

      // Set color and abbreviation for every schedule in timetable
      tweakedTimetable.schedules = tweakedTimetable.schedules.map(
        (schedule) => {
          return {
            ...schedule,
            color: "slate",
            abbreviation: schedule.title
              .split(" ")
              .map((x) => x[0])
              .join(""),
          };
        }
      );

      // TODO: Rename title if it already exists

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
          value={username}
          onChangeText={setUsername}
          disabled={loading || !!tempTimetable}
        />
        <List.TextInput
          title="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          disabled={loading || !!tempTimetable}
        />
        <List.Button
          title="Authenticate"
          onPress={importTimetable}
          color={colors.lime[500]}
          loading={loading}
          disabled={!username || !password || loading || !!tempTimetable}
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
