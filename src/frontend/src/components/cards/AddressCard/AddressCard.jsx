import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/esm/Stack';
import Badge from 'react-bootstrap/Badge';

import './AddressCard.css';
import SmallButton from '#components/buttons/SmallButton';
import {ReactComponent as GearSVG} from '#svg/gear.svg';
import {ReactComponent as TrashSVG} from '#svg/trash.svg';
import {ReactComponent as CancelSVG} from '#svg/x.svg';


function AddressCard(props) {
    const { className, address, onClickSet, onClickDel } = props
    const { onClickRes, added = false, removed = false } = props
    // Копирование строки адреса по методу, работающему в браузере Chrome,
    // и вставка пробела с нулевой длиной после точек, для создания разрывов.
    const addrCopy = (' ' + address).slice(1).replaceAll('.', '.\u200b')
    
     return (
        <Card className={`${className} + ' rounded-corners justify-content-center'`}>
            <Card.Body className='p-1 card-body-style'>
                <Stack direction='horizontal' className='justify-content-between'>
                    <label className='mx-1 addr-label'>{addrCopy}</label>
                    { added && !removed &&
                        <Stack direction='horizontal'>
                            <Badge bg="" className='addr-badge-new mx-2'>Новый</Badge>
                            <SmallButton className={'py-1 px-2'} onClick={onClickDel}>
                                <TrashSVG width="24" height="24" fill="black"/>
                            </SmallButton>
                        </Stack>
                    }
                    { !added && !removed &&
                        <Stack direction='horizontal' gap={1}>
                            <SmallButton className={'py-1 px-2'} onClick={onClickSet}>
                                <GearSVG width="24" height="24" fill="black"/>
                            </SmallButton>
                            <SmallButton className={'py-1 px-2'} onClick={onClickDel}>
                                <TrashSVG width="24" height="24" fill="black"/>
                            </SmallButton>
                        </Stack>
                    }
                    { removed && !added &&
                        <Stack direction='horizontal'>
                            <Badge bg="" className='addr-badge-del mx-2'>Удалён</Badge>
                            <SmallButton className={'py-1 px-2'} onClick={onClickRes}>
                                <CancelSVG width="24" height="24" fill="black"/>
                            </SmallButton>
                        </Stack>
                    }
                </Stack>
            </Card.Body>
        </Card>
     )
}

export default AddressCard;