import { $authHost, $host} from './index.js';
import download from 'downloadjs';

export const fetchProxy = async () => {
    const {data} = await $host.get('api/proxy');
    return data;
}

export const updateProxy = async () => {
    const {data} = await $authHost.put('api/proxy');
    return data;
}

export const switchProxy = async () => {
    const {data} = await $authHost.post('api/proxy');
    return data;
}

export const resetProxy = async() => {
    const {data} = await $authHost.delete('api/proxy');
    return data;
}

export const downloadCert = async () => {
    const res = await fetch(process.env.REACT_APP_API_URL + 'api/proxy/cert')
    const blob = await res.blob()
    download(blob, 'cert.pem')
}
