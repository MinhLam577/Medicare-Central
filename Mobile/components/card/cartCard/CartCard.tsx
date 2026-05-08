import { useThemeColor } from "@/hooks/useThemeColor";
import { Add, Check, Maximize2, Minus, TickSquare } from "iconsax-react-native";
import React from "react";
import {
    Image,
    ImageStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { convertPrice } from "@/utils/convertPrice";
import Row from "@/components/row/Row";
import ThemeText from "@/components/themeText/ThemeText";
import CheckBox from "@/components/checkBox/CheckBox";
import Space from "@/components/space/Space";

interface CartCardProps {
    onPress?: () => void;
    cartQuantity: number;
    cartQuantityChange?: (value: number) => void;

    productName: string;
    cartPrice: number;
    productImage: string;
    isChecked?: boolean;
    checkedChange?: (value: boolean) => void;

    style?: ViewStyle;
    imageStyle?: ImageStyle;

    type?: "normal" | "small";
}

const CartCard = ({
    onPress,
    cartQuantity,
    cartQuantityChange,
    productName,
    cartPrice,
    productImage,
    style,
    imageStyle,
    isChecked,
    checkedChange,
    type = "normal",
}: CartCardProps) => {

    if (type === "small") {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    flex: 1,
                    backgroundColor: useThemeColor({}, "background"),
                    borderRadius: 8,

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 4,
                    ...style,
                }}
            >
                <Row justifyContent="flex-start">
                    <Image
                        source={{
                            uri:
                                productImage === ""
                                    ? Image.resolveAssetSource(require('../../../assets/images/unknownImage.png')).uri
                                    : productImage,
                        }}
                        style={{
                            width: 100,
                            height: 100,
                            borderTopLeftRadius: 8,
                            borderBottomLeftRadius: 8,
                            objectFit: "contain",
                            ...imageStyle,
                        }}
                    />
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: 16,
                            paddingRight: 8,
                            paddingTop: 8,
                            paddingBottom: 8,
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                        }}
                    >
                        <ThemeText
                            text={productName}
                            numOfLines={4}
                            type="medium"
                            ellipsizeMode="tail"
                            style={{
                                fontWeight: "400",
                                flex: 1
                            }}
                        />
                        <Row justifyContent="space-between">
                            <Row>
                                <ThemeText text={`${convertPrice(cartPrice)}`} type="medium" style={{
                                    fontWeight: "bold",
                                }} />
                                <ThemeText text=" vnd" type="small" style={{
                                    fontWeight: "bold",
                                }} />
                            </Row>
                            <Row>
                                <ThemeText text={`${cartQuantity}`} type="medium" style={{
                                    fontWeight: "bold",
                                }} />
                                <ThemeText text=" items" type="small" style={{
                                    fontWeight: "medium",
                                }} />
                            </Row>
                        </Row>
                    </View>
                </Row>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flex: 1,
                backgroundColor: useThemeColor({}, "itemBackground"),
                borderRadius: 8,
                ...style,
            }}
        >
            <Row justifyContent="flex-start">
                <Image
                    source={{
                        uri:
                            productImage === ""
                                ? "https://anhanime.me/wp-content/uploads/2024/03/anh-nezuko_19.jpg"
                                : productImage,
                    }}
                    style={{
                        width: 100,
                        height: 100,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        objectFit: "contain",
                        ...imageStyle,
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        paddingLeft: 16,
                        paddingRight: 8,
                        paddingTop: 8,
                        paddingBottom: 8,
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                    }}
                >
                    <Row justifyContent="space-between" alignItems="flex-start">
                        <ThemeText
                            text={productName}
                            numOfLines={4}
                            type="medium"
                            ellipsizeMode="tail"
                            style={{
                                fontWeight: "400",
                                flex: 1
                            }}
                        />
                        <CheckBox
                            isChecked={isChecked ?? false}
                            checkedChange={checkedChange}
                        />
                    </Row>
                    <Row justifyContent="space-between">
                        <Row>
                            <ThemeText text={`${convertPrice(cartPrice)}`} type="medium" style={{
                                fontWeight: "bold",
                            }} />
                            <ThemeText text=" vnd" type="small" style={{
                                fontWeight: "bold",
                            }} />
                        </Row>
                        <Row>
                            <TouchableOpacity
                                style={{
                                    padding: 4,
                                    borderRadius: 4,
                                    backgroundColor: useThemeColor({}, 'primary'),
                                }}
                                onPress={() => {
                                    cartQuantityChange?.(cartQuantity - 1);
                                }}
                            >
                                <Minus size={16} color={useThemeColor({}, 'white')} />
                            </TouchableOpacity>
                            <Space size={{ width: 12, height: 0 }} />
                            <ThemeText text={`${cartQuantity}`} type="medium" />
                            <Space size={{ width: 12, height: 0 }} />
                            <TouchableOpacity
                                style={{
                                    padding: 4,
                                    borderRadius: 4,
                                    backgroundColor: useThemeColor({}, 'primary'),
                                }}
                                onPress={() => {
                                    cartQuantityChange?.(cartQuantity + 1);
                                }}
                            >
                                <Add size={16} color={useThemeColor({}, 'white')} />
                            </TouchableOpacity>
                        </Row>
                    </Row>
                </View>
            </Row>
        </TouchableOpacity>
    );
};

export default CartCard;
