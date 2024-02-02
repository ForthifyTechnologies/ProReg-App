import { BlurView } from "expo-blur";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

export default function BottomBar({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <BlurView
      intensity={32}
      tint="systemUltraThinMaterialDark"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 32,
        zIndex: 1,
      }}
    >
      {children}
    </BlurView>
  );
}

BottomBar.Button = function ({
  children,
  icon,
  onPress,
}: {
  children: string;
  // TODO: Use a suitable type for icon
  icon: string;
  onPress?: () => void;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        onPress={onPress}
      >
        <Ionicons
          style={{ marginRight: 8 }}
          name={icon as any}
          size={28}
          color={colors.lime[500]}
        />
        <Text
          style={{ color: colors.lime[500], fontSize: 18, fontWeight: "600" }}
        >
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
