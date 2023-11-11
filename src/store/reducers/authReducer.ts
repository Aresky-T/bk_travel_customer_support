import { Reducer } from "react";
import { ActionType } from "../../types/actions";
import { IAuthState } from "../../types/auth";

const authReducer: Reducer<IAuthState, ActionType> = (state, action) => {
    switch (action.type) {
        case "AUTH|HANDLE_START_LOGIN":
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false,
                errorMessage: ""
            }
        case "AUTH|HANDLE_SUCCESS_LOGIN":
            return {
                ...state,
                data: { ...action.payload },
                isLoading: false,
                isSuccess: true,
                isError: false,
                errorMessage: ""
            }
        case "AUTH|HANDLE_FAILED_LOGIN":
            return {
                ...state,
                isLoading: false,
                isError: true,
                errorMessage: action.payload
            }
        case "AUTH|HANDLE_LOGOUT":
            return {
                ...state,
                data: {
                    role: null,
                    token: null
                },
            }
        default:
            return state
    }
}

export default authReducer