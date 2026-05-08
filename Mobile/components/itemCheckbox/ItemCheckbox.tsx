import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Row from '../row/Row';
import { Maximize2, TickSquare } from 'iconsax-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Space from '../space/Space';
import ThemeText from '../themeText/ThemeText';
import Tag from '../tag/Tag';

interface ItemCheckboxProps {
    label?: string;
    image?: string;
    isChecked: boolean;
    checkedChange?: (checked: boolean) => void;
    delivery_method_description?: string;
    delivery_fee?: string;

    style?: ViewStyle;
}

const ItemCheckbox = ({
    label,
    image,
    isChecked,
    checkedChange,
    delivery_method_description,
    delivery_fee,
    style,
}: ItemCheckboxProps) => {
    const text = useThemeColor({}, "text");
    const background = useThemeColor({}, "background");
    const itemBackground = useThemeColor({}, "itemBackground");
    const primary = useThemeColor({}, "primary");

    return (
        <TouchableOpacity
            style={{
                paddingHorizontal: 8,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: isChecked ? itemBackground : background,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,

                elevation: 2,

                ...style
            }}
            onPress={() => {
                checkedChange?.(!isChecked);
            }}
        >
            <Row justifyContent='space-between'>
                <Row>
                    {label && (
                        <>
                            <ThemeText
                                text={label}
                                type="small"
                                style={{
                                    color: text,
                                }}
                            />
                            <Space size={{ height: 0, width: 8 }} />
                        </>
                    )}
                    {
                        delivery_method_description && (
                            <Row>
                                <Tag text={delivery_method_description}
                                    type='primary'
                                />
                            </Row>
                        )
                    }
                </Row>
                <Row>
                    {
                        delivery_fee && (
                            <>
                                <ThemeText
                                    text={delivery_fee}
                                    type="medium"
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <Space size={{ height: 0, width: 8 }} />
                                <ThemeText
                                    text="VND"
                                    type="small"
                                    style={{
                                        color: text,
                                    }}
                                />
                            </>
                        )
                    }
                    <Space size={{ height: 0, width: 8 }} />
                    {isChecked ? (
                        <TickSquare
                            size={20}
                            color={useThemeColor({}, "primary")}
                        />
                    ) : (
                        <Maximize2 size={20} color={useThemeColor({}, "icon")} />
                    )}
                </Row>
            </Row>
        </TouchableOpacity>
    )
}

export default ItemCheckbox