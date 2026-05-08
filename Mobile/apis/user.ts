import httpRequests from "@/utils/httpRequest"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ImagePickerAsset } from "expo-image-picker"

export const getProfileCurrentUser = async () => {
    const response = await httpRequests.get("/user/profile")
    return response
}

// {{host}}/user/update-profile
export const updateProfileCurrentUser = async (
    user_fullname: string,
    user_phone: string,
    user_birthday: string,
    user_gender: string,
    user_email: string,
) => {
    const response = await httpRequests.post("/user/update-profile", {
        user_fullname: user_fullname,
        user_phone: user_phone,
        user_birthday: user_birthday,
        user_gender: user_gender,
        email: user_email,
    })

    return response
}

export const updateProfileImageCurrentUser = async (
    email: string,
    user_fullname: string,
    imageFile: string,
) => {
    const formData = new FormData()
    formData.append('user_avatar', {
        name: imageFile,
        type: "image/jpeg",
        uri: imageFile,
    })
    formData.append("email", email)
    formData.append("user_fullname", user_fullname)

    return httpRequests.post("/user/update-profile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}

export const getAllAddress = async () => {
    const response = await httpRequests.get("/receiver-address")
    return response
}

export const addAddress = async (
    receiver_name: string,
    receiver_phone: string,
    province_id: string,
    district_id: string,
    ward_id: string,
    receiver_address: string,
) => {
    const response = await httpRequests.post("/receiver-address/add", {
        receiver_name: receiver_name,
        receiver_phone: receiver_phone,
        province_id: province_id,
        district_id: district_id,
        ward_id: ward_id,
        receiver_address: receiver_address,
    })
    return response
}

export const deleteAddress = async (receiver_address_id: number) => {
    const response = await httpRequests.delete(`/receiver-address/delete/${receiver_address_id}`)
    return response
}

export const updateAddress = async (
    receiver_address_id: number,
    receiver_name: string,
    receiver_phone: string,
    province_id: string,
    district_id: string,
    ward_id: string,
    receiver_address: string,
) => {
    const response = await httpRequests.post(`/receiver-address/update/${receiver_address_id}`, {
        receiver_name: receiver_name,
        receiver_phone: receiver_phone,
        province_id: province_id,
        district_id: district_id,
        ward_id: ward_id,
        receiver_address: receiver_address,
    })
    return response
}

export const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
) => {
    const response = await httpRequests.post("/user/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
    })
    return response
}

export const getUserProfile = async () => {
    const response = await httpRequests.get("/user/profile")
    return response
}