export interface CartItem {
    cart_id: number;
    cart_quantity: number;
    cart_price: string;
    product_id: number;
    product_name: string;
    product_images: string[] | null;
    product_quantity: number;
}