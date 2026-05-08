import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View, ViewStyle } from "react-native";
import Space from "../space/Space";
import ThemeText from "../themeText/ThemeText";

interface HorizontalRuleProps {
    text?: string;
    style?: ViewStyle;

    type?: "normal" | "small";
}

const HorizontalRule = ({ text, style, type = 'small' }: HorizontalRuleProps) => {
    if (type === 'normal')
        return (
            <View
                style={[
                    {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    },
                    style,
                ]}
            >
                <View
                    style={{
                        backgroundColor: useThemeColor({}, "text"),
                        height: 0.4,
                        flex: 1,
                    }}
                />
                <Space size={{ width: 8, height: 0 }} />
                {text && <ThemeText text={text} type="medium" style={{
                    fontWeight: '500'
                }}/>}
                <Space size={{ width: 8, height: 0 }} />
                <View
                    style={{
                        backgroundColor: useThemeColor({}, "text"),
                        height: 0.4,
                        flex: 1,
                    }}
                />
            </View>
        )

    return (
        <View
            style={[
                {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                },
                style,
            ]}
        >
            <View
                style={{
                    backgroundColor: useThemeColor({}, "text"),
                    height: 0.4,
                    flex: 1,
                }}
            />
            <Space size={{ width: 8, height: 0 }} />
            {text && <ThemeText text={text} type="small" />}
            <Space size={{ width: 8, height: 0 }} />
            <View
                style={{
                    backgroundColor: useThemeColor({}, "text"),
                    height: 0.4,
                    flex: 1,
                }}
            />
        </View>
    );
};

export default HorizontalRule;
