import httpRequests from "@/utils/httpRequest"

export const signInApi = async (email: string, password: string) => {
    const response = await httpRequests.post("/user/login", {
        email,
        password
    })
    return response
}

export const registerApi = async (fullname: string, email: string, password: string, password_confirmation: string) => {
    const response = await httpRequests.post("/user/register", {
        fullname,
        email,
        password,
        password_confirmation
    })
    return response
}

export const verifyEmailApi = async (email: string) => {
    const response = await httpRequests.post("/user/resend-verify-email", {
        email
    })
    return response
}