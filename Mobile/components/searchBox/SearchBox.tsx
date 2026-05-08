import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { ReactNode } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemeText from "../themeText/ThemeText";

interface SearchBoxProps {
    placeholder: string;
    value?: string;
    icon?: ReactNode;
    onChangeText?: (text: string) => void;

    type?: 'text' | 'button';
    onPress?: () => void;
}

const SearchBox = ({
    placeholder,
    value,
    onChangeText,
    icon,
    type = 'button',
    onPress
}: SearchBoxProps) => {
    if (type === 'button')
        return (
            <TouchableOpacity
                testID="searchBox-button"
                onPress={onPress}
                style={{
                    backgroundColor: useThemeColor({}, "itemBackground"),
                    flex: 1,
                    borderColor: useThemeColor({}, "border"),
                    borderWidth: 1,
                    padding: 8,
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    position: "relative",
                }}
            >
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                {/* <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={useThemeColor({}, "icon")}
                    cursorColor={useThemeColor({}, "text")}
                    style={{
                        flex: 1,
                    }}
                /> */}
                <ThemeText type="medium" text={placeholder} style={{
                    color: useThemeColor({}, "icon"),
                    flex: 1,
                    paddingVertical: 4,
                }}/>
            </TouchableOpacity>
        )
    if (type === 'text')
        return (
            <View
                testID="searchBox-text"
                style={{
                    backgroundColor: useThemeColor({}, "itemBackground"),
                    flex: 1,
                    borderColor: useThemeColor({}, "border"),
                    borderWidth: 1,
                    padding: 8,
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    position: "relative",
                }}
            >
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={useThemeColor({}, "icon")}
                    cursorColor={useThemeColor({}, "text")}
                    style={{
                        flex: 1,
                    }}
                />
            </View>
        );
};

export default SearchBox;
