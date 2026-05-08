export interface PaymentMethod {
    payment_method_id: number;
    payment_method_name: string;
    payment_method_description: string;
    payment_method_logo: string | null;
    payment_is_active: number;
    created_at: string;
    updated_at: string;
}