import { useState } from 'react';
import UserImg from '../../imgs/other/avatar.jpg'
import { useAppContext } from '../../store/context'
import Box from '../styled/box';
import Avatar from '../customer/Avatar';
import DropdownAvatar from './DropdownAvatar';

interface PropsType {
    renderLinks: () => JSX.Element[],
}

const Navbar: React.FC<PropsType> = ({ renderLinks }) => {
    const employee = useAppContext().state.employee;
    const { data, isConnected } = employee;
    const [isShowDropdown, setIsShowDropdown] = useState(false)

    return (
        <div className="navbar-container">
            <div className="navbar_item left">
                <div className="logo flex-center">
                    <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>BK</div>
                </div>
            </div>
            <div className="navbar_item main">
                <ul className="menu">
                    {renderLinks()}
                </ul>
            </div>
            <div className="navbar_item right">
                <div className="name_n_status">
                    <div className="name">
                        <strong>{data?.fullName || "Not Found Name"}</strong>
                    </div>
                    <div className="status">
                        {isConnected ?
                            <span className='onl'>Trực tuyến</span> : <span>Đã mất kết nối</span>
                        }
                    </div>
                </div>
                <Box $position='relative'>
                    <Box
                        $width={40}
                        $height={40}
                        $cursor="pointer"
                        onClick={() => {
                            setIsShowDropdown(!isShowDropdown)
                        }}
                    >
                        <Avatar type='url' url={data?.avatarUrl || UserImg} />
                    </Box>
                    <DropdownAvatar isShow={isShowDropdown} />
                </Box>
            </div>
        </div>
    )
}

export default Navbar