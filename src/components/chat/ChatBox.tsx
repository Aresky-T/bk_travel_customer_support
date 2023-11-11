import React, { useEffect, useRef, useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import { IConversation } from '../../types/chat';
import Avatar from '../customer/Avatar';
import ConversationInfo from './ConversationInfo';
import Box from '../styled/box';
import Button from '../styled/button';
import { FiLogOut } from 'react-icons/fi';
import { useAppContext } from '../../store/context';
import { LuBadgeInfo } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { warningAlertWithCancel } from '../../config/sweetAlertConfig';
import { getStompClient } from '../../config/stompJsConfig';
import { deleteConversationApi } from '../../api/chat.api';

interface PropsType {
    conversation: IConversation,
    renderMessageItem: (conversation: IConversation) => JSX.Element | JSX.Element[],
    messageInput: string,
    handleChangeInput: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleSubmitSendMessage: (event: React.FormEvent<HTMLFormElement>) => void
}

const ChatBox: React.FC<PropsType> = ({ conversation, renderMessageItem, messageInput, handleChangeInput, handleSubmitSendMessage }) => {
    const [isShowConversation, setIsShowConversation] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const { customer } = conversation;
    const { dispatch, state } = useAppContext();
    const { auth, employee } = state;
    // const { currentConversation } = state.chat;

    function deleteConversation() {
        warningAlertWithCancel("Cảnh báo",
            "Các thông tin về cuộc hội thoại bao gồm thông tin khách hàng và các tin nhắn sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa?",
            "Xóa", "Hủy bỏ"
        ).then(result => {
            if (result.isConfirmed) {
                auth.data.token && deleteConversationApi(conversation.id, auth.data.token)
                    .then(res => {
                        const isDeleted = res.data;
                        if (isDeleted) {
                            getStompClient().then(client => {
                                employee.data && client.publish({ destination: `/app/chat/update-conversations/${employee.data.id}` })
                            })
                            toast.success("Xóa cuộc trò chuyện thành công!")
                            dispatch && dispatch({ type: "CHAT|REMOVE|CURRENT_CONVERSATION" });
                        } else {
                            toast.error("Xóa thất bại!")
                        }
                    });
            }
        });
    }

    useEffect(() => {
        if (boxRef.current) {
            const element = boxRef.current;
            element.scrollTop = element.scrollHeight;
        }
    })

    return (
        <div className="chat-box">
            <div className="chat-box__header">
                <div className='chat-box__header__customer'>
                    <div style={{ backgroundColor: "#c2c2c2" }} className='chat-area_header--customer_avatar'>
                        {customer.avatarUrl ?
                            <Avatar type='url' url={customer.avatarUrl} />
                            :
                            <Avatar type='text' text={customer.fullName} />
                        }
                    </div>
                    <div className="customer_name-n-status">
                        <div>{conversation.customer.fullName}</div>
                        <div style={{ fontSize: 11 }}>{conversation.customer.status === "ONLINE" ?
                            <span style={{ color: "var(--green-color)" }}>Đã kết nối</span>
                            :
                            <span style={{ color: "var(--red-color)" }}>Không có kết nối</span>
                        }</div>
                    </div>
                </div>
                <Box className="chat-box__header__options"
                    $display="flex"
                    $alignItems="center"
                    $justifyContent="flex-end"
                    $gap={5}
                >
                    <Button icon={MdDeleteOutline} onClick={deleteConversation} />
                    <Button icon={LuBadgeInfo}
                        onClick={() => {
                            setIsShowConversation(!isShowConversation)
                        }}
                    />
                    <Button icon={FiLogOut}
                        onClick={() => {
                            dispatch && dispatch({
                                type: "CHAT|REMOVE|CURRENT_CONVERSATION"
                            })
                        }}
                    />
                </Box>
            </div>
            <div className="chat-box__body cs-scroll"
                ref={boxRef}
            >
                {renderMessageItem(conversation)}
            </div>
            <form className="chat-box__footer" onSubmit={handleSubmitSendMessage}>
                <div className="message-container">
                    <input id="message"
                        // rows={1}
                        max-rows={3}
                        placeholder="Nhập tin nhắn"
                        spellCheck={false}
                        value={messageInput}
                        onChange={handleChangeInput}
                    ></input>
                </div>
                <button className="send-message"
                    type='submit'
                    style={messageInput.trim() !== "" ? {} : {
                        pointerEvents: "none",
                        color: "gray"
                    }}
                >
                    <IoMdSend />
                </button>
            </form>
            {isShowConversation && <ConversationInfo
                conversation={conversation}
                deleteConversation={deleteConversation}
            />}
        </div>
    )
}

export default ChatBox