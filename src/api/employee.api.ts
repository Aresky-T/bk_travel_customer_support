import axios from "axios";
import { configApi } from "./config";

const employeeUrl = "http://localhost:8080/api/v1/employee";

export const getDetailsEmployeeApi = (token:string) => {
    return axios.get(`${employeeUrl}`, configApi(token))
}