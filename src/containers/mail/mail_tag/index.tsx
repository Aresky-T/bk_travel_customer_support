import Box from "../../../components/styled/box"
import { useAppContext } from "../../../store/context";
import { IMail } from "../../../types/mail"

interface PropsType {
    mail: IMail,
}

const MailTagContainer: React.FC<PropsType> = ({ mail }) => {
    const dispatch = useAppContext().dispatch;

    const renderContent = (sender: "EMPLOYEE" | "CUSTOMER", content: string) => {
        if (sender === "CUSTOMER") {
            return `Nhận - ${content}`
        } else {
            return `Gửi - ${content}`
        }
    }

    const renderReplyCount = () => {
        const count = mail.reply?.length || 0;
        if (count > 0) {
            return `${count} thư trả lời`
        }

        return <b>Chưa trả lời</b>
    }

    return (
        <Box className={"mail-tag"}>
            <Box key={mail.id}
                $transition="all 50ms linear"
                className="mail-tag read"
                onClick={() => {
                    dispatch && dispatch({ type: "MAIL|SET|CURRENT_MAIL", payload: mail })
                }}
            >
                <Box className="mail-tag__header"
                    $paddingInline={15}
                    $height={50}
                    $backgroundColor="#fff"
                    $boxShadow="0 0 1px 0 rgba(0, 0, 0, .5)"
                    $fontSize={".8rem"}
                    $display="flex"
                    $alignItems="center"
                    $justifyContent="space-between"
                    $gap={50}
                    $cursor="pointer"
                    $transition="all 100ms linear"
                >
                    <Box $display="flex" $gap={5}
                        className="mail-tag__header__title-n-content"
                    >
                        <span className="title">{mail.title}</span>
                        <span className="content">{renderContent(mail.sender, mail.content)}</span>
                    </Box>
                    <Box
                        $display="flex"
                        $alignItems="center"
                        $justifyContent="space-between"
                        $gap={20}
                        className="mail-tag__header__count-n-sent-at"
                    >
                        <span className="mail-tag__header__count">{renderReplyCount()}</span>
                        <span className="mail-tag__header__sent-at">
                            {new Date(mail.sentAt).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}

export default MailTagContainer;