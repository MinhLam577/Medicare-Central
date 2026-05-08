import Row from '@/components/row/Row';
import ThemeText from '@/components/themeText/ThemeText';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Image, View, ViewStyle } from 'react-native';

interface OrderItemReviewCardProps {
    image: string;
    title: string;

    style?: ViewStyle;
}
const OrderItemReviewCard = ({
    image,
    title,
    style
}: OrderItemReviewCardProps) => {
    
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
                        uri: image
                    }}
                    style={{
                        width: 100,
                        height: 100,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        objectFit: "contain",
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
                        text={title}
                        numOfLines={4}
                        type="medium"
                        ellipsizeMode="tail"
                        style={{
                            fontWeight: "bold",
                            flex: 1,
                        }}
                    />
                </View>
            </Row>
        </View>
    )
}

export default OrderItemReviewCard