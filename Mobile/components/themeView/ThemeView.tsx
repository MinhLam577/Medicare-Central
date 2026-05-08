import { View, Text, ViewProps, ViewStyle } from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ThemeViewProps {
    children: React.ReactNode;

    style?: ViewStyle;
}

const ThemeView = (props: ThemeViewProps) => {
    const { children, style } = props;
    const backgroundTheme = useThemeColor({}, "background");
    return (
        <View
            testID="themeView"
            style={{
                backgroundColor: backgroundTheme,
                flex: 1,
                paddingHorizontal: 8,
                paddingTop: 8,
                ...style,
            }}
        >
            {children}
        </View>
    );
};

export default ThemeView;
