import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles";
import BottomBar from "../../components/bottomBar";
import Timetable from "./Timetable";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import useTimetable from "../../hooks/useTimetable";
import { useEffect } from "react";
import HeaderButton from "../../components/header/button";
import { BlurView } from "expo-blur";

export default function TimetableScreen({ navigation }: { navigation: any }) {
  const { timetable } = useTimetable();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: timetable?.title ?? "Timetable",
      headerRight: () => (
        <HeaderButton
          icon="ellipsis-horizontal-circle"
          onPress={() => navigation.navigate("Edit Timetable")}
        />
      ),
      headerLargeStyle: {
        backgroundColor: timetable?.image ? "transparent" : "black",
      },
    });
  }, [timetable]);

  return (
    <ImageBackground
      source={{ uri: timetable?.image }}
      resizeMode="cover"
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: timetable?.image ? "#00000080" : "black" },
        ]}
        contentContainerStyle={{ paddingBottom: 128 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Timetable
          onSchedulePressed={(schedule) => {
            if (!timetable) return;

            // TODO: Find a better way to handle IDs
            const scheduleIndex = timetable.schedules.findIndex(
              (x) => x.title === schedule.title
            );
            navigation.navigate("Edit Schedule", { scheduleIndex, schedule });
          }}
        />
      </ScrollView>
      <BottomBar>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            style={({ pressed }) => ({
              flex: 1,
              borderRadius: 12,
              overflow: "hidden",
              opacity: pressed ? 0.5 : 1,
              marginRight: 12,
            })}
            onPress={() => {
              navigation.navigate("IIUM Catalog");
            }}
          >
            <BlurView
              intensity={64}
              tint="dark"
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="search" size={20} color={colors.zinc[400]} />
              <Text style={{ color: colors.zinc[400], marginLeft: 8 }}>
                Search IIUM's catalog
              </Text>
            </BlurView>
          </Pressable>
          <TouchableOpacity onPress={() => navigation.navigate("Add Schedule")}>
            <Ionicons name="add-circle" size={42} color={colors.lime[500]} />
          </TouchableOpacity>
        </View>
      </BottomBar>
    </ImageBackground>
  );
}
