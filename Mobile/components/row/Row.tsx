import React from "react";
import { View, ViewStyle } from "react-native";

interface RowProps {
    children: React.ReactNode;
    justifyContent?:
        | "center"
        | "flex-start"
        | "flex-end"
        | "space-between"
        | "space-around";
    alignItems?: "center" | "flex-start" | "flex-end" | "stretch";

    style?: ViewStyle;
}

const Row = ({
    children,
    justifyContent = "center",
    alignItems = "center",
    style,
}: RowProps) => {
    return (
        <View
            testID="row"
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent,
                alignItems,
                ...style,
            }}
        >
            {children}
        </View>
    );
};

export default Row;
