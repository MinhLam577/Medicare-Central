import httpRequests from "@/utils/httpRequest"

export const addProductToCartApi = async (productId: number, cartQuantity: number) => {
    return httpRequests.post(`/cart/add`, { product_id: productId, cart_quantity: cartQuantity })
}

export const getCartApi = async () => {
    try {
        const rs = await httpRequests.get(`/cart`)
        return rs
    } catch {
        return {
            status: 500,
            data: []
        }
    }
}

export const updateCartApi = async (productId: number, cartQuantity: number) => {
    return httpRequests.post(`/cart/update`, { cart_quantity: cartQuantity, product_id: productId })
}

export const deleteCardApi = async (ids_cart: number[]) => {
    return httpRequests.post(`/cart/delete-many`, { ids_cart: ids_cart })
}