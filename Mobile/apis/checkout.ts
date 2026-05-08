import { Address } from "@/type/addressType"
import { DeliveryMethod } from "@/type/deliveryType"
import { PaymentMethod } from "@/type/paymentType"
import httpRequests from "@/utils/httpRequest"

export const getDeliveryMethodsApi = async () => {
    const response = await httpRequests.get("/deliveries")
    return response
}

export const getPaymentMethodsApi = async () => {
    const response = await httpRequests.get("/payments")
    return response
}

export const checkoutCartApi = async (
    receiver_address_id: number,
    payment_id: number,
    delivery_id: number,
    ids_cart: number[]
) => {
    const response = await httpRequests.post(`/orders/checkout-cart`, {
        receiver_address_id,
        payment_id,
        delivery_id,
        ids_cart
    })
    return response
}

export const checkoutSingleApi = async (
    receiver_address_id: number,
    payment_id: number,
    delivery_id: number,
    product_id: number,
    quantity: number
) => {
    const response = await httpRequests.post('/orders/buy-now', {
        receiver_address_id,
        payment_id,
        delivery_id,
        product_id,
        quantity
    })
    return response
}