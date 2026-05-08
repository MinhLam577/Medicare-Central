import { useThemeColor } from "@/hooks/useThemeColor";
import { Maximize2, TickSquare } from "iconsax-react-native";
import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import Row from "../row/Row";
import Space from "../space/Space";
import ThemeText from "../themeText/ThemeText";

interface CheckBoxProps {
    label?: string;
    isChecked: boolean;
    checkedChange?: (checked: boolean) => void;

    style?: ViewStyle;
}

const CheckBox = ({
    label,
    isChecked,
    checkedChange,
    style,
}: CheckBoxProps) => {
    return (
        <TouchableOpacity
            testID="checkbox"
            style={{
                padding: 8,
                borderRadius: 4,
            }}
            onPress={() => {
                checkedChange?.(!isChecked);
            }}
        >
            <Row>
                {isChecked ? (
                    <TickSquare
                        testID="checked"
                        size={20}
                        color={useThemeColor({}, "primary")}
                    />
                ) : (
                    <Maximize2 testID="unCheck" size={20} color={useThemeColor({}, "icon")} />
                )}
                {label && (
                    <Space
                        size={{
                            width: 8,
                            height: 0,
                        }}
                    />
                )}
                {label && (
                    <ThemeText
                        text={label}
                        type="small"
                        style={{
                            color: useThemeColor({}, "text"),
                        }}
                    />
                )}
            </Row>
        </TouchableOpacity>
    );
};

export default CheckBox;
