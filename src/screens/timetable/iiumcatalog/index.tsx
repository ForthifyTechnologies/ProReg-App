import {
  ScrollView,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Pressable,
} from "react-native";
import { styles } from "@/styles";
import { useEffect, useState, useCallback } from "react";
import colors from "tailwindcss/colors";
import HeaderButton from "@/components/header/button";
import { Ionicons } from "@expo/vector-icons";

// api
// https://proreg.forthify.tech/api/timetables/imaluum?subject=

export default function IIUMCatalogScreen({ navigation }: { navigation: any }) {
  const [search, setSearch] = useState("");
  const [timetable, setTimetable] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Setup header buttons
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton title="Cancel" onPress={navigation.goBack} />
      ),
    });
  }, [navigation]);

  const fetchTimetable = useCallback(async () => {
    if (!search) {
      return;
    }
    setIsLoading(true);
    const response = await fetch(
      `https://proreg.forthify.tech/api/timetables/imaluum?subject=${search}`
    );
    const data = await response.json();
    const groupedByCourseCode = data.reduce((acc: any, current: any) => {
      const { code, title, creditHours, lecturer, section, venue, weekTimes } =
        current;
      if (!acc[code]) {
        acc[code] = {
          courseName: title,
          creditHours,
          subjects: [],
        };
      }
      acc[code].subjects.push({ lecturer, section, venue, weekTimes });
      return acc;
    }, {});
    setTimetable(groupedByCourseCode);
    setIsLoading(false);
  }, [search]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.zinc[900],
        },
      ]}
    >
      <View
        style={{
          height: 48,
          backgroundColor: colors.zinc[800],
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          margin: 16,
        }}
      >
        <Ionicons name="search" size={20} color={colors.zinc[400]} />
        <TextInput
          style={{
            color: "white",
            marginLeft: 8,
            fontSize: 16,
            flex: 1,
          }}
          placeholder="Search for courses..."
          placeholderTextColor={colors.zinc[400]}
          autoFocus
          onChangeText={setSearch}
          value={search}
          onSubmitEditing={fetchTimetable}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>
      <ScrollView
        style={{
          flex: 1,
          padding: 16,
        }}
      >
        {isLoading ? (
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Loading...
          </Text>
        ) : (
          Object.entries(timetable).map(
            // @ts-ignore
            ([courseCode, { courseName, creditHours, subjects }], index) => (
              <View
                key={index}
                style={{
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {courseName}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  ({courseCode})
                </Text>
                {subjects.map((subject: Schedule, subjectIndex: number) => (
                  <Pressable
                    onPress={() => {
                      navigation.navigate("View Catalog", {
                        schedule: {
                          ...subject,
                          title: courseName,
                          code: courseCode,
                          creditHours,
                        },
                      });
                    }}
                    key={subjectIndex}
                    style={{
                      backgroundColor: colors.zinc[800],
                      padding: 12,
                      borderRadius: 12,
                      marginBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.zinc[400],
                        fontSize: 14,
                      }}
                    >
                      Section {subject.section}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {subject.lecturer && subject.lecturer.length > 0
                        ? subject.lecturer.join(", ")
                        : subject.lecturer}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
