import httpRequests from "@/utils/httpRequest"

export const getAllBrands = async () => {
    return httpRequests.get(`/brands`)
}