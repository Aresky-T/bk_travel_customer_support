import React from 'react'
import { IChat } from '../../types/chat';
import ICustomer from '../../types/customer';
import { BsCheckAll } from "react-icons/bs"
import { FaEye } from 'react-icons/fa'
import Avatar from '../customer/Avatar';
import Box from '../styled/box';

interface PropsType {
    chat: IChat,
    customer: ICustomer,
}

const MessageItem: React.FC<PropsType> = (props) => {
    const { chat, customer } = props;
    const { message, sender, sentAt, status } = chat;
    const messageClass = sender === "CUSTOMER" ? "customer-message" : "your-message"

    return (
        <div className={`${messageClass} chat-message`}>
            {sender === "CUSTOMER" &&
                <Box $width={30} $height={30} $alignSelf='flex-end'>
                    {customer.avatarUrl ?
                        <Avatar type='url' url={customer.avatarUrl} />
                        :
                        <Avatar type='text' text={customer.fullName} style={{ fontSize: "1rem" }} />
                    }
                </Box>
            }
            <div className="content">
                <div className="content__message">
                    {message}
                </div>
                <div className="content__sent-at">
                    {new Date(sentAt).toLocaleString("vi-VN", { timeStyle: "short" })}
                </div>
            </div>
            {sender === "EMPLOYEE" &&
                <div className="status">
                    {status === "NEW" && <BsCheckAll />}
                    {status === "SEEN" && <FaEye />}
                </div>
            }
        </div>
    )
}

export default MessageItem