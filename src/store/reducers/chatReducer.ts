import { Reducer } from "react";
import { IChatState } from "../../types/chat";
import { ActionType } from "../../types/actions";

const chatReducer: Reducer<IChatState, ActionType> = (state, action) => {
    switch (action.type) {
        case "CHAT|SET|CONVERSATION_LIST":
            return { ...state, conversations: action.payload }
        case "CHAT|SET|CURRENT_CONVERSATION":
            return { ...state, currentConversation: action.payload }
        case "CHAT|UPDATE|CURRENT_CONVERSATION":
            if (state.currentConversation) {
                const currentConversation = { ...state.currentConversation, ...action.payload }
                return { ...state, currentConversation }
            }
            return state;
        case "CHAT|CLEAR|CONVERSATION_LIST":
            return { ...state, conversations: [] }
        case "CHAT|REMOVE|CURRENT_CONVERSATION":
            return { ...state, currentConversation: null };
        default:
            return state;
    }
}

export default chatReducer;