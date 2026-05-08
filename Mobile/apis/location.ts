import httpRequests from "@/utils/httpRequest"

export const getProvinces = async () => {
    return httpRequests.get("/provinces")
}

export const getDistricts = async (provinceId: number) => {
    return httpRequests.get(`/districts/${provinceId}`)
}

export const getWards = async (districtId: number) => {
    return httpRequests.get(`/wards/${districtId}`)
}
