export interface UserProfile {
    user_id: number;
    user_fullname: string;
    email: string;
    user_phone: string | null;
    user_birthday: string | null;
    user_gender: number;
    user_avatar: string | null;
    user_weight: number | null;
    user_height: number | null;
    user_ibm: number | null;
    user_is_block: number;
    user_is_delete: number;
    email_verified_at: string;
    user_created_at: string;
    user_updated_at: string;
}
