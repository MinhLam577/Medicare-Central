export interface DeliveryMethod {
    delivery_method_id: number;
    delivery_method_name: string;
    delivery_fee: string;
    delivery_method_description: string;
    delivery_method_logo: string | null;
    delivery_is_active: number;
    created_at: string;
    updated_at: string;
}