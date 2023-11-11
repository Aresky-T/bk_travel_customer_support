import React, { Fragment, useState } from "react"
import ChatBox from "../../../components/chat/ChatBox";
import { useAppContext } from "../../../store/context";
import { IChat, IChatListFilter, IConversation } from "../../../types/chat";
import MessageItem from "../../../components/chat/MessageItem";
import { getStompClient } from "../../../config/stompJsConfig";

interface PropsType {
    conversation: IConversation
}

const ChatBoxContainer: React.FC<PropsType> = (props) => {
    const [messageInput, setMessageInput] = useState<string>('');
    const { state } = useAppContext();
    const employee = state.employee;
    const conversation = props.conversation;

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMessageInput(event.target.value);
    }

    const handleSubmitSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (messageInput.trim() === '') return;
        try {
            const client = await getStompClient();
            client.publish({
                destination: `/app/chat/send.to.customer/conversation/${conversation.id}`,
                body: JSON.stringify({ message: messageInput, sender: "EMPLOYEE" })
            });
            setTimeout(() => {
                client.publish({
                    destination: `/app/chat/update-conversations/${employee.data?.id}`
                })
            }, 100)
            setMessageInput("");
        } catch (error) {
        }
    }

    function groupMessagesBySentAt(messages: IChat[]) {
        const groupedMessages = new Map<string, IChat[]>();
        const result: IChatListFilter[] = [];

        messages.forEach((message) => {
            const sentAt = new Date(message.sentAt);
            const date = new Date(sentAt.getFullYear(), sentAt.getMonth(), sentAt.getDate());
            const dateString = date.toDateString();
            if (groupedMessages.has(dateString)) {
                const existingMessage = groupedMessages.get(dateString);
                existingMessage?.push(message);
            } else {
                groupedMessages.set(dateString, [message])
            }
        })

        groupedMessages.forEach((value, key) => {
            result.push({ date: new Date(key), chats: value })
        })

        return result;
    }

    const renderMessageItem = (conversation: IConversation) => {
        const { chatList, customer } = conversation;
        const getSentTime = (sentAt: string) => {
            return new Date(sentAt).getTime();
        }
        chatList.sort((a, b) => getSentTime(a.sentAt) - getSentTime(b.sentAt));
        const chatListFilter = groupMessagesBySentAt(chatList);

        if (chatList.length) {
            return chatListFilter.map((item, index) => {
                const { chats, date } = item;
                const today = new Date();
                const dateStringFull = date.toLocaleDateString("vi-VN", { dateStyle: "full" });
                const dateStringLong = date.toLocaleDateString("vi-VN", { dateStyle: "long" })
                return (
                    <Fragment key={index}>
                        <div className="date-of-messages">
                            <span>{date.getDate() === today.getDate() ? `Hôm nay, ${dateStringLong}` : dateStringFull}</span>
                        </div>
                        <>
                            {chats.map(chat => (
                                <MessageItem chat={chat} customer={customer} key={chat.id} />
                            ))}
                        </>
                    </Fragment>
                )
            })
        };

        return (
            <div className="none-message message-item">
                <div className='content'>
                    Khách hàng "<b>{customer.fullName}</b>" đã kết nối tới bạn!
                </div>
            </div>
        )
    }

    return (
        <ChatBox
            conversation={conversation}
            messageInput={messageInput}
            handleChangeInput={handleChangeInput}
            handleSubmitSendMessage={handleSubmitSendMessage}
            renderMessageItem={renderMessageItem}
        />
    )
}

export default ChatBoxContainer