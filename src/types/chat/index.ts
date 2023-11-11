import ICustomer from "../customer"

export interface IChat {
    id: number,
    message: string,
    sender: 'EMPLOYEE' | 'CUSTOMER',
    sentAt: string,
    status: 'NEW' | 'SEEN'
}

export interface IChatListFilter {
    date: Date,
    chats: IChat[]
}

export interface IConversation {
    id: number,
    customer: ICustomer,
    newMessagesCount: number,
    latestChat: IChat,
    chatList: IChat[],
}

// export interface IConversationList {
//     type: "IConversationList",
//     data: IConversation[]
// }

export interface IChatState {
    conversations: IConversation[],
    currentConversation: IConversation | null,
}