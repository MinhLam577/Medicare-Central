export interface Address {
    receiver_address_id: number;
    user_id: number;
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
}