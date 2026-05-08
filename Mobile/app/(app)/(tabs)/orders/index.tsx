import { getOrders } from "@/apis/order";
import OrderCard from "@/components/card/orderCard/OrderCard";
import EmptyData from "@/components/emptyData/EmptyData";
import Header from "@/components/header/Header";
import Space from "@/components/space/Space";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { ORDER_STATUS } from "@/constants/order_status";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Order } from "@/type/orderType";
import HorizontalScrollMenu, { RouteProps } from '@nyashanziramasanga/react-native-horizontal-scroll-menu/src';
import { Href, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";

const Orders = () => {
    const items = [
        {
            id: 1,
            name: ORDER_STATUS.PENDING,
        },
        {
            id: 2,
            name: ORDER_STATUS.CONFIRMED,
        },
        {
            id: 3,
            name: ORDER_STATUS.SHIPPED,
        },
        {
            id: 4,
            name: ORDER_STATUS.DELIVERED,
        },
        {
            id: 5,
            name: ORDER_STATUS.CANCELLED,
        }
    ];
    const [selectedIndex, setSelectedIndex] = useState(1);

    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);

    const fetchOrders = async () => {
        let type: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' = 'pending';
        switch (selectedIndex) {
            case 1:
                type = ORDER_STATUS.PENDING;
                break;
            case 2:
                type = ORDER_STATUS.CONFIRMED;
                break;
            case 3:
                type = ORDER_STATUS.SHIPPED;
                break;
            case 4:
                type = ORDER_STATUS.DELIVERED;
                break;
            case 5:
                type = ORDER_STATUS.CANCELLED;
                break;
        }
        const rs = await getOrders(type, 8, page)
        if (rs.data?.data?.length === (0 || undefined)) {
            return
        }
        if (page === 1) {
            setOrders(rs.data?.data ?? []);
        } else {
            setOrders((prev) => [...prev, ...rs.data?.data ?? []]);
        }
    }

    useEffect(() => {
        (async () => {
            fetchOrders();
        })()
    }, [page])

    useEffect(() => {
        setPage(1);
        setOrders([]);
        fetchOrders()
    }, [selectedIndex])

    return (
        <ThemeView>
            <Header type="main"/>
            <HorizontalScrollMenu
                items={items}
                onPress={(route: RouteProps) => {
                    setSelectedIndex(route.id);
                }}
                selected={selectedIndex}
                itemWidth={120}
                scrollAreaStyle={{ height: 40, width: '100%', backgroundColor: useThemeColor({}, 'background') }}
                upperCase={true}
                activeTextColor={useThemeColor({}, 'text')}
                activeBackgroundColor={useThemeColor({}, 'itemBackground')}
                buttonStyle={{
                    borderWidth: 0,
                }}
            />
            <Space size={{ height: 8, width: 0 }} />
                {
                    orders.length === 0 ? (
                        <EmptyData
                            title="No orders found"
                            imageStyle={{
                                width: '60%'
                            }}
                        />
                    ) : (
                        <FlatList
                            data={orders}
                            renderItem={({ item, index }) => (
                                <OrderCard order={item}
                                    key={index}
                                    onPress={() => {
                                        router.navigate(
                                            ("/(tabs)/orders/orderDetail/" +
                                                item.order_id) as Href
                                        );
                                    }}
                                />
                            )}
                            onEndReached={() => {
                                console.log('end reached');
                                setPage(page + 1);
                            }}
                            onEndReachedThreshold={0.8}
                            contentContainerStyle={{ gap: 12, padding: 8 }}
                        />
                    )
                }
        </ThemeView>
    );
};

export default Orders;
