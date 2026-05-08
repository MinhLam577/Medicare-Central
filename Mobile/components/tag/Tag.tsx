import { View, Text } from "react-native";
import React from "react";
import ThemeText from "../themeText/ThemeText";
import { useThemeColor } from "@/hooks/useThemeColor";
interface TagProps {
    text: string;
    type: "primary" | "secondary";
}
const Tag = ({
    text,
    type
}: TagProps) => {
    return (
        <View testID="tag" style={{
            backgroundColor: type === "primary" ? useThemeColor({}, "primaryLight") :
                useThemeColor({}, "secondary"),
            padding: 8,
            borderRadius: 4,
            alignSelf: 'flex-start'
        }}>
            <ThemeText type="small" text={text} style={{
                color: type === "primary" ? useThemeColor({}, "primary") :
                    useThemeColor({}, "secondary"),
                alignSelf: 'flex-start',
            }}
            />
        </View>
    );
};

export default Tag;
