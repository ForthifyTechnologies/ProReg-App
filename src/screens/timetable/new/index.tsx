import { ScrollView, Text } from "react-native";
import { styles } from "../../../styles";
import List from "../../../components/list";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import HeaderButton from "../../../components/header/button";
import { addTimetable } from "../../../database/controllers/timetable";

export default function NewTimetableScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const existingTitles: string[] = route.params.existingTitles;

  // Title
  const [title, setTitle] = useState("");

  useEffect(() => {
    // Setup header buttons
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton title="Cancel" onPress={navigation.goBack} />
      ),
      headerRight: () => (
        <HeaderButton title="Add" bold disabled={!validate()} onPress={add} />
      ),
    });
  }, [navigation, title]);

  function validate() {
    if (!title || title === "") return false;
    if (title.length > 32) return false;
    if (existingTitles.includes(title)) return false;
    return true;
  }

  async function add() {
    if (!validate()) return;

    const timetable: Timetable = {
      title: title,
      schedules: [],
    };
    await addTimetable(timetable);
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

      <Text
        style={{
          color: "white",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Or...
      </Text>

      {/* Import */}
      <List lighter title="Import Timetables">
        {/* FIXME: Highlight on press not working expectedly on lighter backgrounds */}
        <List.Button
          title="Import From i-Ma'luum"
          onPress={() =>
            navigation.navigate("Import From i-Ma'luum", { existingTitles })
          }
        />
      </List>
    </ScrollView>
  );
}
