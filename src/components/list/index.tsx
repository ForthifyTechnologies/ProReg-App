import React, { createContext, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const LighterContext = createContext(false);

export default function List({
  children,
  title,
  footer,
  lighter = false,
}: {
  children?: React.ReactNode;
  title?: string;
  footer?: string;
  lighter?: boolean;
}) {
  // Add a divider between each child
  const listWithDivider = React.Children.map(children, (child, index) => {
    if (index === 0) return child;

    return (
      <>
        <View
          style={{
            width: "100%",
            height: 1,
            marginLeft: 16,
            backgroundColor: colors.zinc[lighter ? 700 : 800],
          }}
        />
        {child}
      </>
    );
  });

  return (
    <LighterContext.Provider value={lighter}>
      <View
        style={{
          marginBottom: 36,
        }}
      >
        {title && (
          <Text
            style={{
              color: colors.zinc[400],
              marginBottom: 8,
              marginHorizontal: 16,
            }}
          >
            {title}
          </Text>
        )}

        <View
          style={{
            width: "100%",
            borderRadius: 10,
            backgroundColor: colors.zinc[lighter ? 800 : 900],
            overflow: "hidden",
          }}
        >
          {listWithDivider}
        </View>

        {footer && (
          <Text
            style={{
              color: colors.zinc[400],
              marginTop: 8,
              marginHorizontal: 16,
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            {footer}
          </Text>
        )}
      </View>
    </LighterContext.Provider>
  );
}

List.Base = function ({
  children,
  title,
  color = "white",
}: {
  children?: React.ReactNode;
  title: string;
  color?: string;
}) {
  return (
    <View
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color: color, fontSize: 16 }}>{title}</Text>
      {children}
    </View>
  );
};

List.Text = function ({ value, title }: { value?: string; title: string }) {
  return (
    <List.Base title={title}>
      <Text
        style={{
          color: colors.zinc[400],
          fontSize: 16,
        }}
      >
        {value}
      </Text>
    </List.Base>
  );
};

List.Button = function ({
  onPress,
  title,
  value,
  color = "white",
  loading = false,
  disabled = false,
}: {
  onPress: () => void;
  title: string;
  value?: string;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  const lighter = useContext(LighterContext);

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.zinc[lighter ? 700 : 800] : undefined,
      })}
      onPress={onPress}
      disabled={disabled}
    >
      <List.Base title={title} color={color}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {value && (
            <Text
              style={{
                color: colors.zinc[400],
                fontSize: 16,
                marginRight: 8,
              }}
            >
              {value}
            </Text>
          )}
          {loading ? (
            <ActivityIndicator size={18} />
          ) : (
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.zinc[600]}
            />
          )}
        </View>
      </List.Base>
    </Pressable>
  );
};

List.TextInput = function ({
  value,
  prompt,
  onChangeText,
  title,
  keyboardType = "default",
  secureTextEntry = false,
  disabled = false,
}: {
  value: string;
  prompt?: boolean;
  onChangeText: (text: string) => void;
  title: string;
  keyboardType?: "default" | "numeric";
  secureTextEntry?: boolean;
  disabled?: boolean;
}) {
  if (prompt) {
    return (
      <List.Button
        onPress={() =>
          // TODO: Style the alert buttons to lime color
          Alert.prompt(
            title,
            undefined,
            onChangeText,
            undefined,
            value,
            keyboardType
          )
        }
        title={title}
        value={value}
        disabled={disabled}
      />
    );
  }
  return (
    <TextInput
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 16,
        color: "white",
      }}
      value={value}
      onChangeText={onChangeText}
      placeholder={title}
      selectionColor={colors.lime[500]}
      placeholderTextColor={colors.zinc[600]}
      keyboardAppearance="dark"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      editable={!disabled}
    />
  );
};

List.DateTimePicker = function ({
  value,
  onChange,
  title,
  mode = "datetime",
}: {
  value: Date;
  onChange: (date: Date) => void;
  title: string;
  mode: "date" | "time" | "datetime";
}) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  return (
    <>
      <List.Button
        onPress={() => setDatePickerVisibility(true)}
        title={title}
        value={
          mode === "datetime"
            ? moment(value).format("DD/MM/YYYY hh:mm A")
            : mode === "date"
            ? moment(value).format("DD/MM/YYYY")
            : moment(value).format("hh:mm A")
        }
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        isDarkModeEnabled
        mode={mode}
        buttonTextColorIOS={colors.lime[500]}
        minuteInterval={5}
        // TODO: Fix 'lighter' mode modal for date time picker
        date={value}
        onConfirm={(date) => {
          setDatePickerVisibility(false);
          onChange(date);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </>
  );
};
