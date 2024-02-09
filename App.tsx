import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/home";
import TimetableScreen from "./src/screens/timetable";
import AddScheduleScreen from "./src/screens/schedule/add";
import { StatusBar } from "expo-status-bar";
import colors from "tailwindcss/colors";
import NewTimetableScreen from "./src/screens/timetable/new";
import TimetableContextProvider from "./src/contexts/timetable";
import EditScheduleScreen from "./src/screens/schedule/edit";
import EditTimetableScreen from "./src/screens/timetable/edit";
import ImportFromImaluumScreen from "./src/screens/timetable/import/imaluum";
import IIUMCatalogScreen from "@/screens/timetable/iiumcatalog";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TimetableContextProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            // headerBackground: () => (
            //   <BlurView
            //     tint="dark"
            //     intensity={48}
            //     style={StyleSheet.absoluteFill}
            //   />
            // ),
            // TODO: Add border bottom to scrolled header
            headerBlurEffect: "dark",
            headerTransparent: true,
            headerLargeStyle: {
              backgroundColor: "black",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: colors.lime[500],
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "ProReg",
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="Timetable"
            component={TimetableScreen}
            options={{ headerBackTitle: "Home" }}
          />

          <Stack.Screen
            name="New Timetable"
            component={NewTimetableScreen}
            options={{
              presentation: "modal",
              headerBlurEffect: "systemUltraThinMaterialDark",
              headerLargeStyle: { backgroundColor: colors.zinc[900] },
            }}
          />
          <Stack.Screen
            name="Import From i-Ma'luum"
            component={ImportFromImaluumScreen}
            options={{
              presentation: "modal",
              headerBlurEffect: "systemUltraThinMaterialDark",
              headerLargeStyle: { backgroundColor: colors.zinc[900] },
            }}
          />
          <Stack.Screen
            name="Edit Timetable"
            component={EditTimetableScreen}
            options={{
              presentation: "modal",
              headerBlurEffect: "systemUltraThinMaterialDark",
              headerLargeStyle: { backgroundColor: colors.zinc[900] },
            }}
          />

          <Stack.Screen
            name="Add Schedule"
            component={AddScheduleScreen}
            options={{
              presentation: "modal",
              headerBlurEffect: "systemUltraThinMaterialDark",
              headerLargeStyle: { backgroundColor: colors.zinc[900] },
            }}
          />
          <Stack.Screen
            name="IIUM Catalog"
            component={IIUMCatalogScreen}
            options={{
              presentation: "modal",
              headerBlurEffect: "systemUltraThinMaterialDark",
              headerLargeStyle: { backgroundColor: colors.zinc[900] },
            }}
          />
          <Stack.Screen
            name="Edit Schedule"
            component={EditScheduleScreen}
            options={{
              presentation: "modal",
              headerBlurEffect: "systemUltraThinMaterialDark",
              headerLargeStyle: { backgroundColor: colors.zinc[900] },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TimetableContextProvider>
  );
}
