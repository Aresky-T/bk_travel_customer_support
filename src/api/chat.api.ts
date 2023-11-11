import axios from "axios"


// Rest apis
const chatURL = "http://localhost:8080/api/v1/chat"

export const getAllConversationsForEmployeeApi = (token: string) => {
    return axios.get(`${chatURL}/conversations/employee`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const deleteConversationApi = (conversationId: number, token: string) => {
    return axios.delete(`${chatURL}/conversation/${conversationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}