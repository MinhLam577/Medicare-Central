import {
    addProductToCartApi,
    deleteCardApi,
    getCartApi,
    updateCartApi,
} from "@/apis/cart";
import { CartItem } from "@/type/cartType";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "./auth";

interface CartContextType {
    cartItems: CartItem[];
    reloadData: () => void;
    updateProductInCart: (
        productId: number,
        cartQuantity: number
    ) => Promise<void>;
    addProductToCart: (
        productId: number,
        cartQuantity: number
    ) => Promise<void>;
    removeProductFromCart: (productIds: number[]) => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
    cartItems: [],
    addProductToCart: async () => {},
    updateProductInCart: async () => {},
    removeProductFromCart: async () => {},
    reloadData: () => {},
});

export function CartProvider({ children }: PropsWithChildren) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        (async () => {
            const _cartItems = await getCartApi();
            if (_cartItems.status === 200) {
                setCartItems(_cartItems.data ?? []);
            } else {
                console.log("Error");
                setCartItems([]);
            }
        })();
    }, [user, reload]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                reloadData: () => {
                    setReload(!reload);
                },
                addProductToCart: async (
                    productId: number,
                    cartQuantity: number
                ) => {
                    await addProductToCartApi(productId, cartQuantity);
                    const newCartItems = await getCartApi();

                    setCartItems(newCartItems.data);
                },
                updateProductInCart: async (
                    productId: number,
                    cartQuantity: number
                ) => {
                    await updateCartApi(productId, cartQuantity);
                    setCartItems([
                        ...cartItems.map((item) => {
                            if (item.product_id === productId) {
                                return {
                                    ...item,
                                    cart_quantity: cartQuantity,
                                };
                            }
                            return item;
                        }),
                    ]);
                },
                removeProductFromCart: async (ids_cart: number[]) => {
                    await deleteCardApi(ids_cart);
                    setCartItems(
                        cartItems.filter(
                            (item) => !ids_cart.includes(item.cart_id)
                        )
                    );
                },
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
