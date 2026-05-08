import { View, Text, Touchable, ViewStyle, TextStyle } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import Space from "../space/Space";
import Row from "../row/Row";
import LottieView from "lottie-react-native";

interface ButtonProps {
    text?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    variant?: "circle" | "outline" | 'link' | 'fill';
    color?: 'primary' | 'secondary' | 'danger' | 'text' | 'border';
    onPress?: () => void;
    style?: ViewStyle;

    disabled?: boolean;
    loading?: boolean;
    textStyles?: TextStyle;
}

const Button = ({
    text,
    variant = "fill",
    color = 'primary',
    onPress,
    textStyles,
    icon,
    iconPosition = "left",
    style,
    disabled = false,
    loading = false,
}: ButtonProps) => {
    if (variant === "circle") {
        return (
            <TouchableOpacity
                testID="button"
                disabled={disabled || loading}
                onPress={onPress}
                style={{
                    backgroundColor: "transparent",
                    padding: 12,
                    borderRadius: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...style,
                }}
            >
                {icon && icon}
            </TouchableOpacity>
        );
    }

    if (variant === "outline") {
        return (
            <TouchableOpacity
                testID="button"
                disabled={disabled || loading}
                onPress={onPress}
                style={{
                    backgroundColor: 'transparent',
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 0.5,
                    borderColor: useThemeColor({}, color as any),
                    ...style,
                }}
            >
                {iconPosition === 'left' && icon && icon}
                {iconPosition === 'left' && text && icon && <Space size={{ width: 8, height: 0 }} />}
                {
                    text && (
                        <Text
                            numberOfLines={1}
                            style={{
                                color: useThemeColor({}, color as any),
                                fontSize: 14,
                                ...textStyles,
                            }}
                        >
                            {text}
                        </Text>
                    )
                }
                {iconPosition === 'right' && text && <Space size={{ width: 8, height: 0 }} />}
                {iconPosition === 'right' && icon && icon}
            </TouchableOpacity>
        );
    }

    if (variant === "link") {
        return (
            <TouchableOpacity
                testID="button"
                disabled={disabled || loading}
                onPress={onPress}
                style={{
                    backgroundColor: "transparent",
                    paddingVertical: 4,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...style,
                }}
            >
                {iconPosition === 'left' && icon && icon}
                {iconPosition === 'left' && text && icon && <Space size={{ width: 8, height: 0 }} />}
                <Text
                    numberOfLines={1}
                    style={{
                        color: useThemeColor({}, color as any),
                        fontSize: 14,
                        flexWrap: 'nowrap',
                        ...textStyles,
                    }}
                >
                    {text}
                </Text>
                {iconPosition === 'right' && text && <Space size={{ width: 8, height: 0 }} />}
                {iconPosition === 'right' && icon && icon}
            </TouchableOpacity>
        )
    }

    if (variant === "fill") {
        return (
            <TouchableOpacity
                testID="button"
                disabled={disabled || loading}
                onPress={onPress}
                style={{
                    backgroundColor: useThemeColor({}, color as any),
                    padding: loading ? 0 : 16,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...style,
                }}
            >
                {loading ? (
                    <LottieView
                        testID="loading"
                        source={require("@/assets/animation/buttonLoading.json")}
                        autoPlay
                        loop
                        resizeMode="contain"
                        style={{ width: 54, height: 54 }}
                    />
                ) : (
                    <Row>
                        {iconPosition === 'left' && icon && icon}
                        {iconPosition === 'left' && icon && <Space size={{ width: 8, height: 0 }} />}
                        <Text
                            numberOfLines={1}
                            style={{
                                color: color === "primary" ? "#fff" : "#000",
                                fontSize: 16,
                                flexWrap: 'nowrap',
                                ...textStyles
                            }}
                        >
                            {text}
                        </Text>
                        {iconPosition === 'right' && <Space size={{ width: 8, height: 0 }} />}
                        {iconPosition === 'right' && icon && icon}
                    </Row>
                )}
            </TouchableOpacity>
        );
    }
};

export default Button;
