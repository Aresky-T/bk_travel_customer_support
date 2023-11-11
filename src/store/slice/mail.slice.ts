import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMail, IMailBox, IMailForm, IMailState } from "../../types/mail";
import { getAllMailBoxesApi } from "../../api/mail.api";

const initMailState: IMailState = {
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

const reloadMailState = createAsyncThunk(
    "RELOAD|MAIL_BOXES_LIST",
    async (token: string, thunkApi) => {
        try {
            const res = await getAllMailBoxesApi(token);
            return res.data;
        } catch (error) {
            thunkApi.rejectWithValue("reload mail context failed!");
        }
    }
)

const mailSlice = createSlice({
    name: "mail",
    initialState: initMailState,
    reducers: {
        SET_MAIL_BOXES_LIST: (state, action: PayloadAction<IMailBox[]>) => {
            state.mailBoxList = action.payload;
        },
        SET_CURRENT_MAIL_BOX: (state, action: PayloadAction<IMailBox>) => {
            if (!state.currentMailBox || state.currentMailBox.id !== action.payload.id) {
                state.currentMailBox = action.payload;
            }
        },
        SET_CURRENT_MAIL: (state, action: PayloadAction<IMail>) => {
            state.currentMail = action.payload
        },
        UPDATE_MAIL_FORM: (state, action: PayloadAction<IMailForm>) => {
            const payload = action.payload
            state.mailForm = { ...state.mailForm, ...payload };
        },
        RESET_MAIL_FORM: (state, action) => {
            state.mailForm["title"] = "";
            state.mailForm["content"] = "";
            state.mailForm["recipient"] = "";
            state.mailForm["originalMail"] = null;
        },
        REMOVE_MAIL_BOXES_LIST: (state, action) => {
            state.mailBoxList = [];
        },
        REMOVE_CURRENT_MAIL_BOX: (state, action) => {
            state.currentMailBox = null;
        },
        REMOVE_CURRENT_MAIL: (state, action) => {
            state.currentMail = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(reloadMailState.fulfilled, (state, action) => {
            state.mailBoxList = action.payload;
        });
        builder.addCase(reloadMailState.rejected, (state, action) => {

        })
    }
})

export const { REMOVE_CURRENT_MAIL, REMOVE_CURRENT_MAIL_BOX, REMOVE_MAIL_BOXES_LIST, RESET_MAIL_FORM, SET_CURRENT_MAIL, SET_CURRENT_MAIL_BOX, SET_MAIL_BOXES_LIST, UPDATE_MAIL_FORM } = mailSlice.actions;
export default mailSlice.reducer