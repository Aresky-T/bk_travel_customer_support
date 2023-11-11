import React, { useCallback, useEffect, useState } from 'react'
import { IConversation } from '../../types/chat';
import Avatar from '../customer/Avatar';
import { useAppContext } from '../../store/context';
import Box from '../styled/box';
import moment from 'moment';

interface PropsType {
    conversation: IConversation,
}

const ConversationTag: React.FC<PropsType> = ({ conversation }) => {
    const { dispatch, state } = useAppContext();
    const { customer } = conversation;
    const { currentConversation } = state.chat;
    const latestChatItem = conversation.latestChat;

    const [sentAt, setSentAt] = useState('');
    // const newChats = chatList.filter(chat => chat.status === "NEW" && chat.sender === "CUSTOMER");
    const count = conversation.newMessagesCount;
    const isCurrentTag = currentConversation?.id === conversation.id;

    // function renderSentTime() {
    //     const sentAt = new Date(conversation.latestChat.sentAt);
    //     const current = new Date();

    //     const differenceSeconds = (current.getTime() - sentAt.getTime()) / 1000;
    //     const differenceMinutes = (current.getTime() - sentAt.getTime()) / (1000 * 60);
    //     const differenceHours = (current.getTime() - sentAt.getTime()) / (1000 * 60 * 60);
    //     const differenceDates = (current.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24);
    //     const differenceWeeks = (current.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24 * 7);
    //     const differenceYears = (current.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24 * 7 * 365)

    //     if (differenceSeconds >= 0 && differenceSeconds < 60) {
    //         return `${Math.floor(differenceSeconds)} giây`
    //     }

    //     if (differenceMinutes >= 1 && differenceMinutes < 60) {
    //         return `${Math.floor(differenceMinutes)} phút`
    //     }

    //     if (differenceHours >= 1 && differenceHours < 24) {
    //         return `${Math.floor(differenceHours)} giờ`
    //     }

    //     if (differenceDates >= 1 && differenceDates < 7) {
    //         return `${Math.floor(differenceDates)} ngày`
    //     }

    //     if (differenceDates >= 7 && differenceDates < 365) {
    //         return `${Math.floor(differenceWeeks)} tuần`
    //     }

    //     return `${Math.floor(differenceYears)} năm`;
    // }

    const renderSentTimeUsingMomentJS = useCallback(() => {
        const sentAt = moment(conversation.latestChat?.sentAt);
        const current = moment();

        const difference = current.diff(sentAt, "second");

        if (difference < 1) {
            return `mới`
        } else if (difference < 60) {
            return `${difference} giây`
        } else if (difference < 3600) {
            return `${moment.duration(difference, 'second').minutes()} phút`;
        } else if (difference < 86400) {
            return `${moment.duration(difference, 'second').hours()} giờ`;
        } else if (difference < 604800) {
            return `${moment.duration(difference, 'second').days()} ngày`;
        } else if (difference < 31536000) {
            return `${moment.duration(difference, 'second').weeks()} tuần`;
        } else {
            return `${moment.duration(difference, 'second').years()} năm`;
        }
        // eslint-disable-next-line
    }, [conversation.latestChat?.sentAt, sentAt])

    useEffect(() => {
        setTimeout(() => {
            setSentAt(renderSentTimeUsingMomentJS());
        }, 60000)
    }, [renderSentTimeUsingMomentJS])

    return (
        <Box className={isCurrentTag ? "tag current" : "tag"}
            onClick={() => {
                dispatch && dispatch({ type: "CHAT|SET|CURRENT_CONVERSATION", payload: conversation })
            }}
        >
            <Box className="tag-avatar">
                {customer.avatarUrl ?
                    <Avatar type='url' url={customer.avatarUrl} /> :
                    <Avatar type="text" text={customer.fullName} />
                }
                {count > 0 &&
                    <Box className='flex-center'
                        $position='absolute'
                        $bottom={-3}
                        $right={-5}
                        $fontSize={".6rem"}
                        $backgroundColor='var(--red-color)'
                        $color='#fff'
                        $fontWeight={600}
                        $borderRadius={"50%"}
                        $width={20}
                        $height={20}
                    >
                        {count}
                    </Box>
                }
            </Box>
            <Box className="tag-info"
                $width={"100%"}
            >
                <div className='customer-info__fullName'>{customer.fullName}</div>
                {latestChatItem ?
                    <Box
                        $width={"100%"}
                        $display='flex'
                        $justifyContent='space-between'
                        $position='relative'
                    >
                        {latestChatItem.sender === "EMPLOYEE" ?
                            <span>Bạn: {latestChatItem.message}</span> :
                            <span style={{
                                fontWeight: latestChatItem.status === "NEW" ? "bold" : "normal"
                            }}>
                                {latestChatItem.message}
                            </span>
                        }
                        <Box
                            $position='absolute'
                            $right={0}
                            $bottom={0}
                        >{renderSentTimeUsingMomentJS()}</Box>
                    </Box>
                    :
                    <div><b>Khách hàng mới</b></div>
                }
            </Box>
        </Box>
    )
}

export default ConversationTag