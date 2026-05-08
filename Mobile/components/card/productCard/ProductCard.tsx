import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Dimensions, Image, ImageStyle, TouchableOpacity, useColorScheme, ViewStyle } from "react-native";
import { convertPrice } from "@/utils/convertPrice";
import ThemeView from "@/components/themeView/ThemeView";
import Row from "@/components/row/Row";
import ThemeText from "@/components/themeText/ThemeText";

interface ProductCardProps {
    imageUrls: string[];
    title: string;
    price?: string;
    sold?: number;
    onPress?: () => void;
    style?: ViewStyle;
    imageStyle?: ImageStyle;
}

const ProductCard = ({
    imageUrls,
    price,
    sold,
    title,
    style,
    onPress,
    imageStyle,
}: ProductCardProps) => {
    let width = Dimensions.get('screen').width / 2 - 32
    const theme = useColorScheme() ?? 'light';
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: useThemeColor({}, "itemBackground"),
                borderRadius: 8,
                shadowColor: theme === "light" ? "#000" : "#fff",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,

                elevation: 2,
                ...style,
            }}
        >
            <Image
                source={{
                    uri:
                        imageUrls.length > 0 ? (
                            imageUrls[0] !== "" ? imageUrls[0] : Image.resolveAssetSource(require('../../../assets/images/unknownImage.png')).uri
                        ) : Image.resolveAssetSource(require('../../../assets/images/unknownImage.png')).uri,
                }}
                style={{
                    height: typeof style?.width === 'number' ? style.width * 0.7 : undefined,
                    maxHeight: style?.maxWidth,
                    maxWidth: style?.maxWidth,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    objectFit: "cover",
                    ...imageStyle,
                }}
            />
            <ThemeView style={{
                backgroundColor: useThemeColor({}, "itemBackground"),
                padding: 8,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                display: "flex",
                flexDirection: "column",
            }}>
                <Row
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    style={{
                        minHeight: 46,
                    }}
                >
                    <ThemeText text={title} type="medium" style={{
                        fontWeight: "400",
                    }}
                        ellipsizeMode="tail"
                        numOfLines={3}
                    />
                </Row>
                {
                    price && (
                        <Row justifyContent="space-between" style={{
                            marginTop: 8,
                            flex: 1,
                        }}>
                            <Row>
                                <ThemeText text={`Sold: `} type="small" style={{}} />
                                <ThemeText text={sold?.toString()} type="small" style={{ fontWeight: "bold" }} />
                            </Row>
                            <Row>
                                <ThemeText
                                    text={convertPrice(parseInt(price))}
                                    type="medium"
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <ThemeText
                                    text=" vnđ"
                                    type="small"
                                    style={{
                                        fontWeight: "500",
                                    }}
                                />
                            </Row>
                        </Row>
                    )
                }
            </ThemeView>
        </TouchableOpacity>
    );
};

export default ProductCard;
