import { View, Text, ViewStyle, Dimensions } from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TouchableOpacity } from "react-native-gesture-handler";
import ThemeText from "../../themeText/ThemeText";
interface SettingCardProps {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
    style?: ViewStyle;
}
const SettingCard = ({ icon, title, onPress, style }: SettingCardProps) => {
    let screenWidth = Dimensions.get('screen').width - 32;
    return (
        <View
            style={{
                backgroundColor: useThemeColor({}, "itemBackground"),
                padding: 16,

                marginBottom: 8,
                minHeight: screenWidth / 3,
                ...style,
            }}
        >
            <TouchableOpacity
                onPress={onPress}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <View
                    style={{
                        marginBottom: 8,
                    }}
                >
                    {icon}
                </View>
                <ThemeText
                    type="small"
                    style={{ textAlign: "center", fontWeight: "500" }}
                    text={title}
                />
            </TouchableOpacity>
        </View>
    );
};

export default SettingCard;
