import axios from "axios"
import { configApi } from "./config";
import { IMailForm } from "../types/mail";

const mailUrl = "http://localhost:8080/api/v1/mail";

export const getAllMailBoxesApi = (token: string) => {
    return axios.get(`${mailUrl}/mail-box/get-all`, configApi(token));
}

export const getMailBoxByIdApi = (token: string, id: number) => {
    return axios.get(`${mailUrl}/mail-box/${id}`, configApi(token));
}

export const sendMailReplyToCustomerApi = (mail: IMailForm, token: string) => {
    return axios.post(`${mailUrl}/send-to-customer`, mail, configApi(token));
}

export const getDetailsMailById = (token: string, mailId: number) => {
    return axios.get(`${mailUrl}/details/${mailId}`, configApi(token));
}

export const deleteMailByIdApi = (token: string, mailId: number) => {
    return axios.delete(`${mailUrl}/${mailId}`, configApi(token));
}

export const deleteMailBoxByIdApi = (token: string, mailBoxId: number) => {
    return axios.delete(`${mailUrl}/mail-box/${mailBoxId}`, configApi(token))
}