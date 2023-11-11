import React, { useEffect, useState } from 'react'
import Box from '../styled/box'
import Button from '../styled/button'
import ReactQuill from 'react-quill'
import styled from 'styled-components'
import { BsSend } from 'react-icons/bs'
import { AiOutlineDelete } from 'react-icons/ai'
import { getDetailsMailById, sendMailReplyToCustomerApi } from '../../api/mail.api'
import { useAppContext } from '../../store/context'
import { IMailForm } from '../../types/mail'
import ValidateUtils from '../../utils/validate'
import { REGEX } from '../../constants/regex'
import { toast } from 'react-toastify'
import Loading from '../loading/DualsRing'
import { getStompClient } from '../../config/stompJsConfig'

const QillStyled = styled(ReactQuill)`
    height: 200px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;

    .ql-container {
        overflow: hidden;
        .ql-editor {
            overflow-y: scroll;

            &::-webkit-scrollbar {
                width: 3px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #4a4a4a;
                border-radius: 5px;
            }

            &::-webkit-scrollbar-track {
                background-color: #ececec;
            }
        }
    }
    div.ql-snow {
        border: none;
    }
`
interface PropsType {
    handleCloseForm: () => void
}

const MailReplyForm = ({ handleCloseForm }: PropsType) => {
    const { state, dispatch } = useAppContext();
    const { auth, employee } = useAppContext().state;
    const { currentMailBox, mailForm, currentMail } = state.mail;
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    function validateMailForm(mail: IMailForm) {
        const validate = ValidateUtils({
            form: mail,
            rules: {
                title: {
                    required: true,
                },
                content: {
                    required: true,
                },
                recipient: {
                    required: true,
                    regex: REGEX.MAIL
                }
            },
        })
        return validate;
    }

    async function handleSendMail() {
        try {
            const { errors, isValid } = validateMailForm(mailForm);
            if (auth.data.token && isValid) {
                setIsLoading(true);
                const res = await sendMailReplyToCustomerApi(mailForm, auth.data.token);
                const message = res.data?.message;
                if (message === "success") {
                    setIsLoading(false);
                    setIsUpdated(true);
                    toast.success("Đã gửi mail thành công!", { position: "bottom-right" });
                    getStompClient().then(client => {
                        employee.data && client.publish({ destination: `/app/mail/load.mailboxes.of.employee/${employee.data.id}` });
                    })
                } else if (message === "failed") {
                    setIsLoading(false);
                    toast.error("Gửi mail thất bại", { position: "bottom-right" });
                }
            } else {
                toast.error("Thông tin không hợp lệ!", { position: "bottom-right" });
                console.log(errors)
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error)
        }
    }

    useEffect(() => {
        if (dispatch && currentMailBox && currentMail) {
            dispatch({
                type: "MAIL|UPDATE|MAIL_FORM", payload: {
                    recipient: currentMailBox.customer.email,
                    originalMail: currentMail.id,
                }
            })
        }
    }, [dispatch, currentMailBox, currentMail])

    useEffect(() => {
        if (isUpdated && auth.data.token && currentMail) {
            getDetailsMailById(auth.data.token, currentMail.id)
                .then(res => {
                    const data = res.data;
                    if (dispatch) {
                        dispatch({
                            type: "MAIL|SET|CURRENT_MAIL",
                            payload: data
                        });
                        dispatch({ type: "MAIL|RESET|MAIL_FORM" })
                    }
                    setIsUpdated(false);
                    handleCloseForm();
                })
                .catch(err => {
                })
        }
        // eslint-disable-next-line
    }, [isUpdated]);

    return (
        <Box className='reply-form-container'
            $width={"100%"}
        >
            <Box $display='flex' $flexDirection='column' $gap={15}>
                <textarea
                    name="title"
                    cols={30} rows={1}
                    placeholder='Nhập tiêu đề'
                    className='cs-scroll'
                    value={mailForm.title || ""}
                    onChange={(event) => {
                        dispatch && dispatch({
                            type: "MAIL|UPDATE|MAIL_FORM",
                            payload: { title: event.target.value }
                        })
                    }}
                ></textarea>
                <QillStyled
                    theme='snow'
                    placeholder='Nhập nội dung'
                    defaultValue=""
                    value={mailForm.content || ""}
                    onChange={(value) => {
                        dispatch && dispatch({
                            type: "MAIL|UPDATE|MAIL_FORM",
                            payload: { content: value }
                        })
                    }}
                />
            </Box>
            <Box
                $display='flex'
                $gap={20}
            >
                <Button
                    text='Gửi' icon={BsSend} revert={true}
                    className='submit'
                    onClick={handleSendMail}
                />
                <Button
                    text='Hủy' icon={AiOutlineDelete}
                    className='cancel'
                    onClick={handleCloseForm}
                />
            </Box>
            <Loading isLoading={isLoading} />
        </Box>
    )
}

export default MailReplyForm