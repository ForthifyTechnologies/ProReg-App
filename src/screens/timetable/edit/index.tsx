import { Alert, ScrollView, Text } from "react-native";
import { styles } from "../../../styles";
import List from "../../../components/list";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import HeaderButton from "../../../components/header/button";
import useTimetable from "../../../hooks/useTimetable";

export default function EditTimetableScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  // const existingTitles: string[] = route.params.existingTitles;

  const { timetable, updateTimetableDetails, deleteTimetable } = useTimetable();

  // Title
  const [title, setTitle] = useState("");

  // Details
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState<number | null>(null);

  useEffect(() => {
    if (!timetable) return;

    // Title
    setTitle(timetable.title);

    // Details
    setUniversity(timetable?.university || "");
    setYear(timetable?.year || "");
    setSemester(timetable?.semester || null);
  }, [timetable]);

  useEffect(() => {
    // Setup header buttons
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton title="Cancel" onPress={navigation.goBack} />
      ),
      headerRight: () => (
        <HeaderButton
          title="Update"
          bold
          disabled={!validate()}
          onPress={update}
        />
      ),
    });
  }, [navigation, title, university, year, semester]);

  function validate() {
    if (!title || title === "") return false;
    if (title.length > 32) return false;
    // TODO: Check if title already exists
    // if (existingTitles.includes(title)) return false;
    return true;
  }

  async function update() {
    if (!validate()) return;

    updateTimetableDetails({
      title,
      university,
      year,
      semester: semester || undefined,
    });
    navigation.goBack();
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.zinc[900] }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Title */}
      <List lighter title="Title">
        <List.TextInput
          title="Timetable Name"
          value={title}
          onChangeText={setTitle}
        />
      </List>

      {/* Details */}
      <List lighter title="Details">
        <List.TextInput
          prompt
          title="University"
          value={university}
          onChangeText={setUniversity}
        />
        <List.TextInput
          prompt
          title="Year"
          value={year}
          onChangeText={setYear}
        />
        <List.TextInput
          prompt
          title="Semester"
          value={semester?.toString() || ""}
          onChangeText={(text) => setSemester(parseInt(text))}
          keyboardType="numeric"
        />
      </List>

      {/* Customization */}
      <List lighter title="Customization">
        <List.Button
          title="Change Background"
          onPress={() => {
            //
          }}
        />
      </List>

      {/* Danger Zone */}
      <List lighter title="Danger Zone">
        <List.Button
          title="Delete Schedule"
          color={colors.red[500]}
          onPress={() => {
            Alert.alert(
              "Delete Timetable",
              "Are you sure you want to delete this timetable?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    deleteTimetable();
                    navigation.goBack();
                    // Delay navigation to help trigger the reload of
                    // the timetable list in the home screen
                    setTimeout(() => {
                      navigation.goBack();
                    }, 100);
                  },
                },
              ]
            );
          }}
        />
      </List>
    </ScrollView>
  );
}
