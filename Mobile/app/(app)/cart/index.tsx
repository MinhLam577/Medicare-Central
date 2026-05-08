import Button from "@/components/button/Button";
import CartCard from "@/components/card/cartCard/CartCard";
import CheckBox from "@/components/checkBox/CheckBox";
import Row from "@/components/row/Row";
import Space from "@/components/space/Space";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { CartContext } from "@/context/cart";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CartItem } from "@/type/cartType";
import { convertPrice } from "@/utils/convertPrice";
import { Href, router } from "expo-router";
import { Back } from "iconsax-react-native";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import ConfirmationModal from "react-native-confirmation";
import { FlatList } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const Card = () => {
    const { cartItems, updateProductInCart, removeProductFromCart } =
        useContext(CartContext);
    const [checkedList, setCheckedList] = React.useState<number[]>([]);

    const [isCheckedAll, setIsCheckedAll] = React.useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkedList: number[] = [];
        cartItems.forEach((item: CartItem) => {
            checkedList.push(item.product_id);
        });
        setCheckedList(checkedList);
    }, [cartItems]);

    // function
    const caculateTotal = () => {
        let total = 0;
        cartItems.forEach((item) => {
            if (checkedList.includes(item.product_id))
                total +=
                    Number.parseFloat(item.cart_price) * item.cart_quantity;
        });
        return total;
    };

    return (
        <ThemeView>
            <Row
                style={{
                    justifyContent: "space-between",
                    backgroundColor: useThemeColor({}, "background"),
                }}
            >
                <Button
                    variant="circle"
                    icon={<Back size={20} color={useThemeColor({}, "text")} />}
                    onPress={() => {
                        router.back();
                    }}
                />

                <ThemeText text="Cart" type="title" />

                <Button
                    variant="link"
                    color="danger"
                    text="Delete"
                    onPress={() => {
                        setIsVisible(true);
                    }}
                />
            </Row>
            <ThemeView style={{}}>
                <FlatList
                    data={cartItems}
                    renderItem={({ item, index }) => (
                        <CartCard
                            onPress={() => {
                                router.navigate(
                                    ("/(app)/products/product/" +
                                        item.product_id) as Href
                                );
                            }}
                            cartQuantityChange={async (value) => {
                                try {
                                    await updateProductInCart(
                                        item.product_id,
                                        value
                                    );
                                } catch (error: any) {
                                    Toast.show({
                                        text1: error.messages,
                                        type: 'error'
                                    });
                                }
                            }}
                            key={index}
                            productImage={item.product_images?.[0] ?? ""}
                            productName={item.product_name}
                            cartPrice={Number.parseFloat(item.cart_price)}
                            cartQuantity={item.cart_quantity}
                            isChecked={checkedList.includes(item.product_id)}
                            checkedChange={(value) => {
                                if (value) {
                                    setCheckedList([
                                        ...checkedList,
                                        item.product_id,
                                    ]);
                                } else {
                                    setCheckedList(
                                        checkedList.filter(
                                            (id) => id !== item.product_id
                                        )
                                    );
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={{
                        gap: 8,
                    }}
                />
                <Space size={{ height: 16, width: 0 }} />
                <Row
                    style={{
                        justifyContent: "space-between",
                        borderRadius: 8,
                        padding: 16,
                        backgroundColor: useThemeColor({}, "itemBackground"),
                        marginBottom: 16,
                    }}
                >
                    <CheckBox
                        isChecked={isCheckedAll}
                        label="All"
                        checkedChange={(value) => {
                            setIsCheckedAll(value);
                            if (value) {
                                const checkedList: number[] = [];
                                cartItems.forEach((item) => {
                                    checkedList.push(item.product_id);
                                });
                                setCheckedList(checkedList);
                            } else {
                                setCheckedList([]);
                            }
                        }}
                    />
                    <Row style={{
                        paddingHorizontal: -8,
                    }}>
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "flex-end",
                            }}
                        >
                            <ThemeText text="Total" type="medium" />
                            <Row>
                                <ThemeText
                                    text={`${convertPrice(caculateTotal())}`}
                                    type="large"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: useThemeColor({}, "primary"),
                                    }}
                                />
                                <ThemeText
                                    text=" vnd"
                                    type="small"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 14,
                                        color: useThemeColor({}, "primary"),
                                    }}
                                />
                            </Row>
                        </View>
                        <Space size={{ width: 16, height: 0 }} />
                        <Button
                            color="primary"
                            text="Checkout"
                            onPress={() => {
                                const cartidsSelected = cartItems.filter(
                                    (item) => {
                                        return checkedList.includes(
                                            item.product_id
                                        );
                                    }
                                ).map((item) => item.cart_id);
                                router.navigate(
                                    ("/(app)/checkout/checkoutcarts/" +
                                        JSON.stringify(cartidsSelected)) as Href
                                );
                            }}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                            }}
                        />
                    </Row>
                </Row>
            </ThemeView>
            <ConfirmationModal
                colorScheme={"system"}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                message="Are you sure you want to delete?"
                onConfirm={async () => {
                    try {
                        const cartItemDelete = cartItems.filter(
                            (item) => {
                                return checkedList.includes(
                                    item.product_id
                                );
                            }
                        );
                        await removeProductFromCart(
                            cartItemDelete.map(
                                (item) => item.cart_id
                            )
                        );
                        setIsVisible(false);
                    } catch (error: any) {
                        console.log(error);
                        Toast.show({
                            text1: error.messages[0],
                            type: 'error'
                        });
                    }
                }}
            />
        </ThemeView>
    );
};

export default Card;
