import React, { useState } from "react"
import Box from "../../../components/styled/box"
import { IMail } from "../../../types/mail"
import ICustomer from "../../../types/customer"
import { BiSolidRightArrow, BiSolidDownArrow } from 'react-icons/bi'
import { HiMiniArrowUturnLeft } from 'react-icons/hi2'
import { AiOutlineDelete } from 'react-icons/ai'
import MailReplyForm from "../../../components/chat/MailReplyForm"
import Button from "../../../components/styled/button"
import MailReply from "../../../components/mail/MailReply"

interface PropsType {
    mail: IMail,
    customer: ICustomer,
}

const MailDetails: React.FC<PropsType> = (props) => {
    const { mail } = props;
    const { reply } = mail;
    const [isReply, setIsReply] = useState(false);

    return (
        <Box
            $transition="all 50ms linear"
            $backgroundColor="#fff"
            $height={"100%"}
            className="mail-detail read"
            $display="flex"
            $flexDirection="column"
            $justifyContent="space-between"
        >
            <Box
                $padding={"10px 15px"}
                $height={"100%"}
                $fontSize={".8rem"}
                $display="flex"
                $flexDirection="column"
                $alignItems="flex-start"
                $gap={10}
                $transition="all 100ms linear"
                $overflowY="scroll"
                className="cs-scroll"
            >
                <Box
                    $display="flex"
                    $alignItems="center"
                    $gap={10}
                >
                    <Box $minWidth={60}>Tiêu đề</Box>
                    <BiSolidRightArrow color='var(--gray-color)' />
                    <b>{mail.title}</b>
                </Box>
                <Box
                    $display="flex"
                    $alignItems="center"
                    $gap={10}
                >
                    <Box $minWidth={60}>{mail.sender === "CUSTOMER" ? "Tới tôi" : "Gửi đi"}</Box>
                    <BiSolidRightArrow color='var(--gray-color)' />
                    <span className="mail-detail__header__sent-at"
                        style={{ fontSize: ".6rem" }}
                    >
                        {new Date(mail.sentAt).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                </Box>
                <Box
                    $display="flex"
                    $flexDirection="column"
                    $alignItems="flex-start"
                    $gap={20}
                >
                    <Box
                        $display="flex"
                        $alignItems="center"
                        $gap={10}
                    >
                        <Box $minWidth={60}>Nội dung</Box>
                        <BiSolidDownArrow color='var(--gray-color)' />
                    </Box>
                    <Box>{mail.content}</Box>
                </Box>
                {reply && reply.map((item, index) => (
                    <MailReply mailReply={item} key={item.id} />
                ))}
            </Box>
            <Box
                $height="fit-content"
                $fontSize={".8rem"}
                $backgroundColor="#f2f2f2"
            >
                {isReply ?
                    <MailReplyForm handleCloseForm={() => {
                        setIsReply(false);
                    }} />
                    :
                    <Box
                        $display="flex"
                        $gap={15}
                        $padding={15}
                        $background="#fff"
                        className="mail-details__action_btn"
                    >
                        <Button
                            text="Trả lời"
                            icon={HiMiniArrowUturnLeft}
                            onClick={() => {
                                setIsReply(true);
                            }}
                        />
                        <Button
                            text="Xóa thư này"
                            icon={AiOutlineDelete}
                        />
                    </Box>
                }
            </Box>
        </Box>
    )
}

export default MailDetails