import HorizontalRule from '@/components/horizontalRule/HorizontalRule'
import Row from '@/components/row/Row'
import Space from '@/components/space/Space'
import Tag from '@/components/tag/Tag'
import ThemeText from '@/components/themeText/ThemeText'
import ThemeView from '@/components/themeView/ThemeView'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Order } from '@/type/orderType'
import { convertPrice } from '@/utils/convertPrice'
import { ArrowRight2 } from 'iconsax-react-native'
import React from 'react'
import { View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface OrderCardProps {
    order: Order;
    onPress?: () => void;
}

const OrderCard = ({
    order,
    onPress
}: OrderCardProps) => {

    return (
        <View style={{
            flex: 1,
            borderRadius: 8,
            backgroundColor: useThemeColor({}, 'background'),
            margin: 4
        }}>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    backgroundColor: useThemeColor({}, "itemBackground"),
                    paddingHorizontal: 8,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,

                    borderBottomWidth: 1,
                    borderBottomColor: useThemeColor({}, 'white')
                }}
            >
                <Row justifyContent='space-between'>
                    <Row justifyContent='flex-start'>
                        <ThemeText type='medium' text='Order ID: ' />
                        <ThemeText type='medium' text={order.order_id.toString()} style={{
                            fontWeight: 'bold'
                        }} />
                    </Row>
                    <Row>
                        <Tag
                            text={order.delivery_method_name}
                            type='primary'
                        />
                        <ThemeText text={(new Date(order.order_created_at)).toDateString()} type='medium' style={{
                            marginLeft: 8,
                            marginRight: 8
                        }} />
                        <ArrowRight2 size={16} color={useThemeColor({}, 'icon')} />
                    </Row>
                </Row>
            </TouchableOpacity>
            <ThemeView
                style={{
                    backgroundColor: useThemeColor({}, "itemBackground"),
                    paddingHorizontal: 8
                }}
            >
                <ThemeView style={{
                    backgroundColor: useThemeColor({}, 'itemBackground'),
                    paddingHorizontal: 4,
                    paddingTop: 0,
                    paddingBottom: 8
                }}>
                    <Row justifyContent="flex-start">
                        <View>
                            <Image
                                source={{
                                    uri:
                                        JSON.parse(order.order_detail[0].product_images)[0] === ""
                                            ? "https://anhanime.me/wp-content/uploads/2024/03/anh-nezuko_19.jpg"
                                            : JSON.parse(order.order_detail[0].product_images)[0],
                                }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 8,
                                    objectFit: "contain",
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                paddingLeft: 16,
                                paddingRight: 8,
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <ThemeText
                                text={order.order_detail[0].product_name}
                                numOfLines={3}
                                type="medium"
                                ellipsizeMode="tail"
                                style={{
                                    fontWeight: "400",
                                    flex: 1
                                }}
                            />
                            {
                                order.order_detail.length > 1 && (
                                    <Row justifyContent='flex-end' style={{
                                        marginTop: 12,
                                        marginBottom: 12
                                    }}>
                                        <ThemeText text={`With ${order.order_detail.length - 1} other products`} type='medium' style={{
                                            fontWeight: 'bold'
                                        }} />
                                    </Row>
                                )
                            }
                            <Row justifyContent='flex-end'>
                                <ThemeText text='Total Amount: ' type='medium' />
                                <ThemeText text={`${convertPrice(Number(order.order_total_amount))}`} type='medium' style={{
                                    fontWeight: 'bold'
                                }} />
                                <ThemeText text=' VND' type='small' />
                            </Row>
                        </View>
                    </Row>
                </ThemeView>
            </ThemeView>
        </View>
    )
}

export default OrderCard