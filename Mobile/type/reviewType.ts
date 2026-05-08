export interface Review {
    review_id: number;
    user_id: number;
    order_id: number;
    product_id: number;
    review_rating: number;
    review_images: string | null;
    review_comment: string;
    is_approved: number;
    review_created_at: string;
    review_updated_at: string;
    product_name: string;
    product_images: string;
    user_fullname: string;
    user_avatar: string;
}