import React from 'react'
import { ListTagType } from '../../containers/sidebar';
import Box from '../styled/box';

interface ListTagProps {
    listTags: ListTagType,
    renderListTags: (listTags: ListTagType) => JSX.Element[]
}

const ListTag: React.FC<ListTagProps> = (props) => {

    return (
        <Box className='list-tags cs-scroll'>
            {props.renderListTags(props.listTags)}
        </Box>
    )
}

export default ListTag