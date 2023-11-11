import axios from "axios"

const authUrl = "http://localhost:8080/api/v1/auth"

export const loginEmployeeApi = (formData: { username: string, password: string }) => {
    return axios.post(`${authUrl}/login`, formData)
}

export const validateTokenApi = (token: string) => {
    return axios.get(`${authUrl}/validate-token`, {
        params: {
            token: token
        }
    })
}