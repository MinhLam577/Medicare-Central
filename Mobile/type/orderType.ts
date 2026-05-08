export interface Order {
    order_id: number;
    user_id: number;
    receiver_address_id: number;
    order_total_amount: string;
    order_status: string;
    order_note: string | null;
    order_created_at: string;
    order_updated_at: string;
    user_fullname: string;
    user_avatar: string;
    payment_method_name: string;
    delivery_method_name: string;
    payment_status: string;
    payment_id: number;
    delivery_status: string;
    delivery_id: number;
    receiver_name: string;
    receiver_phone: string;
    province_id: number;
    district_id: number;
    ward_id: number;
    receiver_address: string;
    receiver_created_at: string;
    receiver_updated_at: string;
    created_at: string | null;
    updated_at: string | null;
    province_name: string;
    district_name: string;
    ward_name: string;
    order_detail: OrderDetail[];
}

export interface OrderDetail {
    order_detail_id: number;
    order_id: number;
    product_id: number;
    import_detail_id: number;
    order_quantity: number;
    order_price: string;
    order_price_discount: string;
    order_total_price: string;
    product_name: string;
    product_images: string;
}
