import React from 'react'
import Box from '../styled/box'
import Button from '../styled/button'
import { LuUserCog2 } from 'react-icons/lu'
import { FiLogOut } from 'react-icons/fi'
import { useAppContext } from '../../store/context'
import { useNavigate } from 'react-router-dom'

interface PropsType {
    isShow: boolean,
}

const DropdownAvatar: React.FC<PropsType> = ({ isShow }) => {
    const { dispatch } = useAppContext();
    const navigate = useNavigate();

    return (
        <Box
            $position='absolute'
            $right={0}
            $top={"120%"}
            $background={"#fff"}
            $width={200}
            $padding={10}
            $borderRadius={10}
            $boxShadow='0 0 5px 0 rgba(0, 0, 0, .4)'
            className={isShow ? "dropdown-avatar active" : "dropdown-avatar"}
        >
            <Button
                text='Hồ sơ'
                icon={LuUserCog2}
            />
            <Button
                text='Đăng xuất'
                icon={FiLogOut}
                onClick={() => {
                    localStorage.clear();
                    dispatch && dispatch({ type: "AUTH|HANDLE_LOGOUT" })
                    navigate("/");
                }}
            />
        </Box>
    )
}

export default DropdownAvatar