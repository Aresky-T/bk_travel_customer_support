import ICustomer from "../customer"

export interface IMailReply {
    id: number,
    title: string,
    content: string,
    repliedAt: string,
}

export interface IMail {
    id: number,
    title: string,
    content: string,
    sentAt: string,
    sender: "CUSTOMER" | "EMPLOYEE",
    reply: IMailReply[] | null,
}

export interface IMailBox {
    id: number,
    customer: ICustomer,
    unrepliedEmailsCount: number,
    latestMail: Omit<IMail, "reply">,
    mailList: IMail[],
}

// export interface IMailBoxList {
//     type: "IMailBoxList",
//     data: IMailBox[],
// }

export interface IMailForm {
    recipient: string,
    title: string,
    content: string,
    originalMail: number | null
}

export interface IMailState {
    mailBoxList: IMailBox[],
    currentMailBox: IMailBox | null,
    currentMail: IMail | null,
    mailForm: IMailForm,
}