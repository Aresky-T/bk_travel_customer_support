import { initMailState } from './../index';
import { IMailState } from "../../types/mail";
import { ActionType } from '../../types/actions';
import { Reducer } from 'react';

const mailReducer: Reducer<IMailState, ActionType> = (state, action) => {
    const { type } = action;
    switch (type) {
        case "MAIL|SET|MAIL_BOXES_LIST":
            state.mailBoxList = action.payload
            return { ...state }
        case "MAIL|RELOAD|MAIL_BOXES_LIST":
            return { ...state }
        case "MAIL|SET|CURRENT_MAIL_BOX":
            return { ...state, currentMailBox: action.payload }
        case "MAIL|UPDATE|CURRENT_MAIL_BOX":
            if (state.currentMailBox) {
                state.currentMailBox = { ...state.currentMailBox, ...action.payload }
            }
            return { ...state }
        case "MAIL|SET|CURRENT_MAIL":
            state.currentMail = action.payload
            return { ...state }
        case "MAIL|UPDATE|MAIL_FORM":
            const mailForm = { ...state.mailForm, ...action.payload };
            return { ...state, mailForm };
        case "MAIL|RESET|MAIL_FORM":
            state.mailForm["title"] = "";
            state.mailForm["content"] = "";
            state.mailForm["recipient"] = "";
            state.mailForm["originalMail"] = null;
            return { ...state }
        case "MAIL|REMOVE|MAIL_BOXES_LIST":
            state.mailBoxList = [];
            return { ...state }
        case "MAIL|REMOVE|CURRENT_MAIL_BOX":
            state.currentMailBox = null;
            return { ...state }
        case "MAIL|REMOVE|CURRENT_MAIL":
            state.currentMail = null;
            return { ...state }
        case "MAIL|RESET|MAIL_STATE":
            return { ...initMailState }
        default:
            return state;
    }
}

export default mailReducer;