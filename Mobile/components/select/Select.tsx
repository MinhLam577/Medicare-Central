import { useThemeColor } from "@/hooks/useThemeColor";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Row from "../row/Row";
import ThemeText from "../themeText/ThemeText";

export interface OptionType {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    options: OptionType[];
    value?: string;
    onChange: (value: string) => void;
    placeHolder?: string;

    style?: ViewStyle;
    numsOfVisibleItems?: number;
}

const Select = ({
    options,
    value,
    onChange,
    label,
    style,
    numsOfVisibleItems,
    placeHolder,
}: SelectProps) => {
    const [open, setOpen] = React.useState(false);

    const primaryColor = useThemeColor({}, "primary");
    const backgroundColor = useThemeColor({}, "background");
    const borderColor = useThemeColor({}, "border");
    const itemBackground = useThemeColor({}, "itemBackground");

    return (
        <View
            testID="select"
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
                    borderRadius: 8,
                    flexDirection: "column",
                    ...style,
                }}
            >
                <TouchableOpacity onPress={() => setOpen(!open)} style={{}}>
                    <Row
                        justifyContent="space-between"
                        style={{
                            flex: 1,
                            paddingHorizontal: 8,
                            paddingVertical: 14,
                            backgroundColor: (value && !open) ? backgroundColor : itemBackground,
                            borderRadius: 8,
                        }}
                    >
                        <ThemeText
                            style={{}}
                            type="medium"
                            text={
                                !value
                                    ? placeHolder
                                    : options.find((opt) => opt.value === value)
                                        ?.label
                            }
                        />
                        <ArrowDown2
                            size={20}
                            color={useThemeColor({}, "icon")}
                        />
                    </Row>
                </TouchableOpacity>
                {open &&
                    options.length > 0 &&
                    numsOfVisibleItems != undefined && (
                        <ScrollView
                            style={{
                                maxHeight: 52 * numsOfVisibleItems,
                            }}
                        >
                            {options.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        onChange(item.value);
                                        setOpen(false);
                                    }}
                                    style={{
                                        backgroundColor: backgroundColor,
                                        padding: 16,
                                        borderBottomWidth: 1,
                                        borderBottomColor: borderColor,
                                    }}
                                >
                                    <ThemeText
                                        type="medium"
                                        text={item.label}
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                {open &&
                    options.length > 0 &&
                    numsOfVisibleItems === undefined &&
                    options.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                onChange(item.value);
                                setOpen(false);
                            }}
                            style={{
                                backgroundColor: backgroundColor,
                                padding: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: borderColor,
                            }}
                        >
                            <ThemeText type="medium" text={item.label} />
                        </TouchableOpacity>
                    ))}
            </View>
        </View>
    );
};

export default Select;
