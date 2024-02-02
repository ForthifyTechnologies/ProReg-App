import { Text, TouchableOpacity } from "react-native";
import colors from "tailwindcss/colors";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderButton({
  title,
  icon,
  onPress,
  bold,
  disabled,
}: {
  title?: string;
  icon?: string;
  onPress?: () => void;
  bold?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      {icon && (
        <Ionicons
          // TODO: Fix Ionicon TypeScript error
          name={icon as any}
          size={26}
          color={disabled ? colors.zinc[600] : colors.lime[500]}
        />
      )}

      {title && (
        <Text
          style={{
            color: disabled ? colors.zinc[600] : colors.lime[500],
            fontSize: 18,
            fontWeight: bold ? "500" : undefined,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
