import simpleRestProvider from '../apiCalls';
import { fetchUtils } from 'ra-core';
// import { cacheDataProviderProxy } from 'react-admin';

// Production URL
export const apiURL = "http://10.2.192.128:4100";
//"http://10.2.192.128:4100"
//"https://testapi.fdpconnect.com";
// "http://172.20.144.1:4100"
// http://10.2.194.222:4100

// Added Token for DataProvider
const httpHeaders = (url, options = {}) => {
    const token = sessionStorage.getItem('token');
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
        if (token) options.headers = new Headers({ Authorization: 'Bearer ' + token });
    }

    options.headers.set('X-Custom-Header', 'FDPConnectAPI V1');
    return fetchUtils.fetchJson(url, options);
}

const restProvider = simpleRestProvider(apiURL, httpHeaders);

// Delayed DataProvider
const delayedDataProvider = new Proxy(restProvider, {
    get: (target, name, self) =>
        name === 'then' // as we await for the dataProvider, JS calls then on it. We must trap that call or else the dataProvider will be called with the then method
            ? self
            : (resource, params) =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve(
                                restProvider[name](resource, params)
                            ),
                        500
                    )
                ),
});

export default delayedDataProvider;
//export default cacheDataProviderProxy(mydataProvider);
