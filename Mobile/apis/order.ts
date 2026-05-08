import httpRequests from "@/utils/httpRequest";

export const getOrders = async (
    type: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
    paginate: number = 5,
    page: number = 1
) => {
    return httpRequests.get(
        `/orders/history?order_status=${type}&page=${page}&paginate=${paginate}`
    );
};

export const getOrder = async (orderId: string) => {
    return httpRequests.get(`/orders/detail/${orderId}`);
};

export const cancelOrder = async (orderId: string) => {
    return httpRequests.post(`/orders/cancel/${orderId}`);
};

export const addReviewProductApi = async (
    order_id: number,
    product_id: number,
    review_rating?: number,
    review_comment?: string,
    review_images?: string[]
) => {
    const formData = new FormData();
    formData.append("order_id", order_id.toString());
    formData.append("product_id", product_id.toString());
    if (review_rating) {
        formData.append("review_rating", review_rating.toString());
    }
    if (review_comment) {
        formData.append("review_comment", review_comment);
    }
    if (review_images) {
        review_images.forEach((image) => {
            formData.append("review_images[]", {
                uri: image,
                type: "image/jpeg",
                name: image.split("/").pop(),
            });
        });
    }
    return httpRequests.post(`/reviews/add`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export const checkCanReview = async (order_id: number, product_id: number) => {
    return httpRequests.get(`/reviews/${order_id}/${product_id}`);
}