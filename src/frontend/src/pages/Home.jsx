import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import '../css/Home.css'
import {ReactComponent as CopyIcon} from '#svg/copy.svg';
import TopBar from '#components/bars/TopBar';
import SmallButton from '#components/buttons/SmallButton';
import MainWindow from '#components/containers/MainWindow/MainWindow.jsx';
import BigButton from '#components/buttons/BigButton';

import { downloadCert, fetchProxy, switchProxy, updateProxy } from '#http/proxyAPI';
import { useAuth } from '#hooks/useAuth';

const Home = observer (() => {
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isProxyWork, setProxyState] = useState(false)
    const [proxyAddr, setProxyAddr] = useState('')
    const [proxyPort, setProxyPort] = useState('')
    useEffect(() => {
        fetchProxy()
            .then(data => {
                let { isActive, domain, port } = data;
                if (isActive) {
                    setProxyState(isActive)
                }
                if (domain && port) {
                     setProxyAddr(domain)
                     setProxyPort(port)
                }
                setLoading(false)
            })
            .catch(e => {
                setError(true)
                setErrorMsg(e.message)
            })
    }, [])

    const handleUpdateProxyConf = async () => {
        setLoading(true)
        updateProxy()
            .then(data => {})
            .catch(err => {
                console.log(err.message)
            })
            .finally(() => setLoading(false))
    }

    const handleSwitchProxyState = async () => {
        switchProxy()
        .then(data => {
            setProxyState(data.isActive)
        })
        .catch(err => console.log(err.message))
    }

    if (error) {
        return (
            <>
            <TopBar title="Главная"/>
            <MainWindow error errorMsg={errorMsg}/>
            </>
        )
    }

    return (
        <>
        <TopBar title="Главная"/>
        <MainWindow className='mx-3 py-2' isLoading={loading} gap={2}>
            
            <Stack className='mb-2'>
                <h2 className='mb-1'>Прокси-сервер</h2>
                <hr className='mt-1 mb-0'/>
            </Stack>

            <Stack direction='horizontal' gap={2} className='align-items-center mb-2'>
                <h4 className='mb-1'>Статус:</h4>
                { isProxyWork ?
                    <Badge bg="" pill style={{backgroundColor: 'limegreen', fontSize: '15px'}}>
                        Работает
                    </Badge>
                    :
                    <Badge bg="" pill style={{backgroundColor: 'crimson', fontSize: '15px'}}>
                        Не работает
                    </Badge>
                }
            </Stack>
            
            <Stack className='mb-3'>
                <h4 className='mb-2'>Адрес:</h4>
                <Card className='rounded-corners'>
                    <Card.Body className='p-1'>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <label className='mx-1 label-style'>{proxyAddr}</label>
                            <CopyToClipboard text={proxyAddr}>
                                <SmallButton className={'pt-1 pb-2 px-2'}>
                                    <CopyIcon width="20" height='20' fill='gray'/>
                                </SmallButton>
                            </CopyToClipboard>
                        </Stack>
                    </Card.Body>
                </Card>
            </Stack>

            <Stack direction='horizontal' gap={3} className='mb-3'>
                <h4 className='mb-0'>Порт:</h4>
                <Card className='rounded-corners'>
                    <Card.Body className='p-1'>
                        <Stack direction='horizontal' className='justify-content-between' gap={1}>
                            <label className='mx-1 label-style'>{proxyPort}</label>
                            <CopyToClipboard text={proxyPort}>
                                <SmallButton className={'pt-1 pb-2 px-2'}>
                                    <CopyIcon width="20" height='20' fill='gray'/>
                                </SmallButton>
                            </CopyToClipboard>
                        </Stack>
                    </Card.Body>
                </Card>
            </Stack>

            <BigButton className={'mb-3'} onClick={() => {downloadCert()}}>
                <label style={{fontSize: '18px'}}>Скачать сертификат</label>
            </BigButton>

            
            
            { user.role === 'ADMIN' &&
            <>
                <BigButton className={'mb-3'} onClick={handleUpdateProxyConf}>
                    <label style={{fontSize: '18px'}}>Обновить конфигурацию</label>
                </BigButton>
                
                <Button className='rounded-corners align-self-center switch-button' 
                    variant={isProxyWork ? 'outline-danger' : 'outline-success'}
                    onClick={handleSwitchProxyState}
                >
                    {isProxyWork ? 'Выключить' : 'Включить'}
                </Button>
            </>
            }
        </MainWindow>
        </>
    )
})

export default Home;