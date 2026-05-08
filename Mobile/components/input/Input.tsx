import { useThemeColor } from "@/hooks/useThemeColor";
import {
    DateTimePickerAndroid,
    DateTimePickerEvent,
    RCTDateTimePickerNative
} from "@react-native-community/datetimepicker";
import React, { ReactNode } from "react";
import { Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import ThemeText from "../themeText/ThemeText";
import { Eye, EyeSlash } from "iconsax-react-native";

interface InputProps {
    type?: "text" | "date" | 'password' | 'number' | 'text-area';
    placeholder?: string;
    value: string;
    icon?: ReactNode;
    style?: ViewStyle;
    iconPosition?: "left" | "right";
    label?: string;

    disabled?: boolean;

    onChangeText?: (text: string) => void;
}

const Input = ({
    type = "text",
    iconPosition = "left",
    placeholder,
    value,
    onChangeText,
    style,
    icon,
    label,
    disabled = false,
}: InputProps) => {
    if (type === 'text-area')
        return (
            <View
                testID="input-area"
                style={{
                    pointerEvents: disabled ? "none" : "auto",
                    display: "flex",
                    ...style
                }}
            >
                {label && (
                    <Text
                        style={{
                            color: useThemeColor({}, "text"),
                            marginBottom: 4,
                            marginLeft: 4,
                            fontSize: 16,
                            fontWeight: "500",
                        }}
                    >
                        {label}
                    </Text>
                )}
                <View
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                        borderColor: useThemeColor({}, "border"),
                        borderWidth: 1,
                        padding: 8,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        position: "relative",
                        opacity: disabled ? 0.6 : 1,
                    }}
                >
                    {icon && iconPosition === "left" && (
                        <View style={{ marginRight: 8 }}>{icon}</View>
                    )}
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={useThemeColor({}, "icon")}
                        cursorColor={useThemeColor({}, "text")}
                        style={{
                            flex: 1,
                            color: useThemeColor({}, "text"),
                        }}
                        multiline={true}
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                    {icon && iconPosition === "right" && (
                        <View
                            style={{
                                position: "absolute",
                                right: 8,
                            }}
                        >
                            {icon}
                        </View>
                    )}
                </View>
            </View>
        )
    const [showPassword, setShowPassword] = React.useState(false);
    if (type === 'number')
        return (
            <View
                testID="input-number"
                style={{
                    pointerEvents: disabled ? "none" : "auto",
                    display: "flex",
                    ...style
                }}
            >
                {label && (
                    <Text
                        style={{
                            color: useThemeColor({}, "text"),
                            marginBottom: 4,
                            marginLeft: 4,
                            fontSize: 16,
                            fontWeight: "500",
                        }}
                    >
                        {label}
                    </Text>
                )}
                <View
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                        borderColor: useThemeColor({}, "border"),
                        borderWidth: 1,
                        padding: 8,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        position: "relative",
                        opacity: disabled ? 0.6 : 1,
                    }}
                >
                    {icon && iconPosition === "left" && (
                        <View style={{ marginRight: 8 }}>{icon}</View>
                    )}
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={useThemeColor({}, "icon")}
                        cursorColor={useThemeColor({}, "text")}
                        style={{
                            flex: 1,
                            color: useThemeColor({}, "text"),
                        }}
                        keyboardType="numeric"
                    />
                    {icon && iconPosition === "right" && (
                        <View
                            style={{
                                position: "absolute",
                                right: 8,
                            }}
                        >
                            {icon}
                        </View>
                    )}
                </View>
            </View>
        )
    if (type === 'password')
        return (
            <View
                testID="input-password"
                style={{
                    pointerEvents: disabled ? "none" : "auto",
                    display: "flex",
                    ...style
                }}
            >
                {label && (
                    <Text
                        style={{
                            color: useThemeColor({}, "text"),
                            marginBottom: 4,
                            marginLeft: 4,
                            fontSize: 16,
                            fontWeight: "500",
                        }}
                    >
                        {label}
                    </Text>
                )}
                <View
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                        borderColor: useThemeColor({}, "border"),
                        borderWidth: 1,
                        padding: 8,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        position: "relative",
                        opacity: disabled ? 0.6 : 1,
                    }}
                >
                    {icon && iconPosition === "left" && (
                        <View style={{ marginRight: 8 }}>{icon}</View>
                    )}
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={useThemeColor({}, "icon")}
                        cursorColor={useThemeColor({}, "text")}
                        style={{
                            flex: 1,
                            color: useThemeColor({}, "text"),
                        }}
                        secureTextEntry={!showPassword}
                    />
                    <View
                        style={{
                            position: "absolute",
                            right: 8,
                        }}
                    >
                        <TouchableOpacity onPress={() => {
                            setShowPassword(!showPassword);
                        }}
                            style={{
                                padding: 8,
                            }}
                        >
                            {showPassword ? (
                                <EyeSlash size={20} color={useThemeColor({}, "icon")} />
                            ) : (
                                <View>
                                    <Eye size={20} color={useThemeColor({}, "icon")} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );

    if (type === "text")
        return (
            <View
                testID="input-text"
                style={{
                    pointerEvents: disabled ? "none" : "auto",
                    display: "flex",
                    ...style
                }}
            >
                {label && (
                    <Text
                        style={{
                            color: useThemeColor({}, "text"),
                            marginBottom: 4,
                            marginLeft: 4,
                            fontSize: 16,
                            fontWeight: "500",
                        }}
                    >
                        {label}
                    </Text>
                )}
                <View
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                        borderColor: useThemeColor({}, "border"),
                        borderWidth: 1,
                        padding: 8,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        position: "relative",
                        opacity: disabled ? 0.6 : 1,
                    }}
                >
                    {icon && iconPosition === "left" && (
                        <View style={{ marginRight: 8 }}>{icon}</View>
                    )}
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={useThemeColor({}, "icon")}
                        cursorColor={useThemeColor({}, "text")}
                        style={{
                            flex: 1,
                            color: useThemeColor({}, "text"),
                        }}
                    />
                    {icon && iconPosition === "right" && (
                        <View
                            style={{
                                position: "absolute",
                                right: 8,
                            }}
                        >
                            {icon}
                        </View>
                    )}
                </View>
            </View>
        );

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            const currentDate =
                selectedDate.getFullYear() +
                "-" +
                (selectedDate.getMonth() + 1) +
                "-" +
                selectedDate.getDate();
            onChangeText?.(currentDate);
        }
    };

    const showDatepicker = () => {
        DateTimePickerAndroid.open({
            value: value ? new Date(value) : new Date(),
            onChange,
            mode: "date",
            is24Hour: true,
        });
    };

    if (type === "date")
        return (
            <View
                testID="input-date"
                style={{
                    pointerEvents: disabled ? "none" : "auto",
                }}
            >
                {label && (
                    <Text
                        style={{
                            color: useThemeColor({}, "text"),
                            marginBottom: 4,
                            marginLeft: 4,
                            fontSize: 16,
                            fontWeight: "500",
                        }}
                    >
                        {label}
                    </Text>
                )}
                <TouchableOpacity
                    onPress={showDatepicker}
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                        borderColor: useThemeColor({}, "border"),
                        borderWidth: 1,
                        padding: 8,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        position: "relative",
                        opacity: disabled ? 0.6 : 1,
                    }}
                >
                    {icon && iconPosition === "left" && (
                        <View style={{ marginRight: 8 }}>{icon}</View>
                    )}
                    <ThemeText
                        text={value}
                        type="medium"
                        style={{
                            paddingVertical: 4,
                        }}
                    />
                    {icon && iconPosition === "right" && (
                        <View
                            style={{
                                position: "absolute",
                                right: 8,
                            }}
                        >
                            {icon}
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
};

export default Input;
