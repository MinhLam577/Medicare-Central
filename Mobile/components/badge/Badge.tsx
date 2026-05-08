import { View, Text } from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

interface BadgeProps {
    count: number;
    children?: React.ReactNode;
}

const Badge = ({ count, children }: BadgeProps) => {
    return (
        <View
            testID="badge"
            style={{
                position: "relative",
            }}
        >
            {children}
            <View
                style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: useThemeColor({}, "red"),
                    borderRadius: 50,
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text
                    style={{
                        color: useThemeColor({}, "white"),
                        fontSize: 10,
                    }}
                >
                    {count}
                </Text>
            </View>
        </View>
    );
};

export default Badge;
