import { Reducer } from "react";
import authReducer from "./authReducer";
import employeeReducer from "./employeeReducer";
import mailReducer from "./mailReducer";
import { ActionType } from "../../types/actions";
import { IAuthState } from "../../types/auth";
import { IEmployeeState } from "../../types/employee";
import { IMailState } from "../../types/mail";
import { IChatState } from "../../types/chat";
import chatReducer from "./chatReducer";

export type RootState = {
    auth: IAuthState,
    employee: IEmployeeState,
    mail: IMailState,
    chat: IChatState,
}

const rootReducer: Reducer<RootState, ActionType> = (state, action) => {
    return {
        ...state,
        auth: authReducer(state.auth, action),
        employee: employeeReducer(state.employee, action),
        mail: mailReducer(state.mail, action),
        chat: chatReducer(state.chat, action),
    }
}

export default rootReducer;