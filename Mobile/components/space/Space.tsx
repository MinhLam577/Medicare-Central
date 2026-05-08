import { View, Text } from "react-native";
import React from "react";

interface SpaceProps {
    size: {
        width: number;
        height: number;
    };
}
const Space = ({ size }: SpaceProps) => {
    return (
        <View
            testID="space"
            style={{
                width: size.width,
                height: size.height,
            }}
        />
    );
};

export default Space;
