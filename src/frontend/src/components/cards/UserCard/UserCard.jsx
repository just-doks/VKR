import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';

import './UserCard.css';
import {ReactComponent as Gear} from '#svg/gear.svg';
import SmallButton from '#components/buttons/SmallButton';

const UserCard = function({className, name, onClick}) {
    return (
        <Card className={`${className} + ' rounded-corners justify-content-center'`}>
            <Card.Body className='p-2 card-body-style'>
                <Stack direction='horizontal' className='justify-content-between'>
                    <label className='mx-1 label-style'>{name}</label>
                    <SmallButton className={'py-1 px-2'} onClick={onClick}>
                        <Gear width="24" height="24" fill="black"/>
                    </SmallButton>
                </Stack>
            </Card.Body>
        </Card>
    )
}

export default UserCard;