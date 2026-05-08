import { checkCanReview } from "@/apis/order";
import Button from "@/components/button/Button";
import Row from "@/components/row/Row";
import ThemeText from "@/components/themeText/ThemeText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { convertPrice } from "@/utils/convertPrice";
import React, { useEffect } from "react";
import {
    Image,
    ImageStyle,
    View,
    ViewStyle
} from "react-native";

interface OrderItemCardProps {
    productQuantity: number;
    productName: string;
    productPrice: number;
    productImage: string;

    style?: ViewStyle;
    imageStyle?: ImageStyle;
    reviewPress: () => void;
    order_id: number;
    product_id: number;
}

const OrderItemCard = ({
    productQuantity,
    productName,
    productPrice,
    productImage,
    style,
    imageStyle,
    reviewPress,
    order_id,
    product_id
}: OrderItemCardProps) => {
    const [isCanReview, setIsCanReview] = React.useState(false);
    useEffect(() => {
        (async () => {
            try {
                await checkCanReview(order_id, product_id);
                setIsCanReview(true);
            } catch {
                setIsCanReview(false);
            }
        })()
    }, [order_id, product_id]);
    return (
        <View
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
                            <ThemeText text={`${convertPrice(productPrice)}`} type="medium" style={{
                                fontWeight: "bold",
                            }} />
                            <ThemeText text=" vnd" type="small" />
                            <Row>
                                <ThemeText text=" x " type="small" />
                                <ThemeText text={`${productQuantity}`} type="medium" style={{
                                    fontWeight: "bold",
                                }} />
                                <ThemeText text=" items" type="small" />
                            </Row>
                        </Row>
                        {
                            isCanReview && (<Button
                                text="Review" variant="fill" style={{
                                    paddingVertical: 4,
                                }}
                                onPress={reviewPress}
                            />)
                        }
                    </Row>
                </View>
            </Row>
        </View>
    );
};

export default OrderItemCard;