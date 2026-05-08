import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
    Text,
    TextProps,
    TextStyle,
    ViewStyle
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface TitleComponentProps {
    text?: string;
    type: "large" | "medium" | "small" | "link" | "title";
    ellipsizeMode?: TextProps["ellipsizeMode"];
    numOfLines?: number;
    children?: React.ReactNode;
    // link
    onPress?: () => void;

    style?: TextStyle | ViewStyle;
}

const ThemeText = ({
    text,
    ellipsizeMode = "clip",
    numOfLines = 10,
    style,
    children,
    type = "large",
    onPress,
}: TitleComponentProps) => {
    const textColorTheme = useThemeColor({}, "text");

    if (type === "title")
        return (
            <Text
                testID="themeText"
                ellipsizeMode={ellipsizeMode}
                numberOfLines={numOfLines}
                style={{
                    color: textColorTheme,
                    fontSize: 18,
                    fontWeight: "bold",
                    ...style,
                }}
            >
                {children ?? text}
            </Text>
        );

    if (type === "large")
        return (
            <Text
                testID="themeText"
                ellipsizeMode={ellipsizeMode}
                numberOfLines={numOfLines}
                style={{
                    color: textColorTheme,
                    fontSize: 36,
                    fontWeight: "bold",
                    ...style,
                }}
            >
                {children ?? text}
            </Text>
        );

    if (type === "link")
        return (
            <TouchableOpacity onPress={onPress}
                testID="themeText"
            >
                <Text
                    ellipsizeMode={ellipsizeMode}
                    numberOfLines={numOfLines}
                    style={{
                        color: useThemeColor({}, "link"),
                        fontSize: 14,
                        ...style,
                    }}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        );

    if (type === "medium")
        return (
            <Text
                testID="themeText"
                ellipsizeMode={ellipsizeMode}
                numberOfLines={numOfLines}
                style={{
                    color: textColorTheme,
                    fontSize: 14,
                    lineHeight: 16,
                    ...style,
                }}
            >
                {text}
            </Text>
        );

    if (type === "small")
        return (
            <Text
                testID="themeText"
                ellipsizeMode={ellipsizeMode}
                numberOfLines={numOfLines}
                style={{
                    color: textColorTheme,
                    fontSize: 12,
                    ...style,
                }}
            >
                {text}
            </Text>
        );
};

export default ThemeText;
