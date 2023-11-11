import { useReducer } from "react"
import { localStorageConfig } from "../config/localStorageConfig"
import AppContext from "./context";
import rootReducer, { RootState } from "./reducers";
import { IMailState } from "../types/mail";
import { IAuth, IAuthState } from "../types/auth";
import { IEmployeeState } from "../types/employee";
import { IChatState } from "../types/chat";

const authStorage = localStorageConfig('acc_info');

const initAuthData: IAuth = {
    role: authStorage.getItem("role"),
    token: authStorage.getItem("token")
}

export const initAuthState: IAuthState = {
    data: initAuthData,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
}

export const initEmployeeState: IEmployeeState = {
    data: null,
    isConnected: false
}

export const initMailState: IMailState = {
    mailBoxList: [],
    currentMailBox: null,
    currentMail: null,
    mailForm: {
        recipient: '',
        title: '',
        content: '',
        originalMail: null,
    }
}

export const initChatState: IChatState = {
    conversations: [],
    currentConversation: null,
}

const initState: RootState = {
    auth: initAuthState,
    employee: initEmployeeState,
    mail: initMailState,
    chat: initChatState,
}

const ContextProvider = (props: any) => {
    const [state, dispatch] = useReducer(rootReducer, initState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default ContextProvider;