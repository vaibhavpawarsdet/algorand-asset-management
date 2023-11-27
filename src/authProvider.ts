import decodeJWT from 'jwt-decode';
import { AuthProvider } from 'ra-core';
import { apiURL } from './dataProvider/rest'
import { Get } from './utils/apiCalls';

// Main Function for authentication
const authProvider: AuthProvider = {
    login: ({ username, password }) => {
        const email = username;
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('permissions');
        sessionStorage.removeItem('invoices_permission');
        sessionStorage.removeItem('po_permission');
        sessionStorage.removeItem('firstname');
        sessionStorage.removeItem('acctype');
        sessionStorage.removeItem('notification');
        sessionStorage.removeItem('insurance');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('cha');
        sessionStorage.removeItem('profile');
        sessionStorage.removeItem('zip_file_permission')
        sessionStorage.removeItem('menuData')
        const request = new Request(apiURL + '/login/authenticate', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    return response.json().then((value: any) => {
                        throw new Error(value.message);
                    })
                }
                return response.json();
            })
            .then(async ({ user, token }) => {
                //let decodedToken = { permissions : ''};
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('permissions', decodeJWT(token));
                sessionStorage.setItem('userid', user.id);
                sessionStorage.setItem('companyid', user.company_id);
                sessionStorage.setItem('firsttime_user', user.first_timeuser);
                sessionStorage.setItem('invoices_permission', user.invoices_permission);
                sessionStorage.setItem('po_permission', user.purchase_order_permission);
                sessionStorage.setItem('notification', "false");
                sessionStorage.setItem('userEmail', user.email);
                sessionStorage.setItem('insurance', user.insurance);
                sessionStorage.setItem('cha', user.cha);

                const response = await Get(apiURL + `/profile/`, sessionStorage.getItem('companyid') as unknown as string)
                if (response && response.data) {
                    sessionStorage.setItem('profile', JSON.stringify(response.data))
                }

                sessionStorage.setItem('zip_file_permission', user.zip_file_permission)
                const responseMenu = await Get(apiURL + "/module/stakeholdernew/", user.id)
                if (responseMenu && responseMenu.data) {
                    sessionStorage.setItem('menuData', JSON.stringify({ ...responseMenu.data.module[0] }));
                }
            });
    },
    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('permissions');
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('companyid');
        sessionStorage.removeItem('firsttime_user');
        sessionStorage.removeItem('invoices_permission');
        sessionStorage.removeItem('po_permission');
        sessionStorage.removeItem('firstname');
        sessionStorage.removeItem('acctype');
        sessionStorage.removeItem('notification');
        sessionStorage.removeItem('insurance');
        sessionStorage.removeItem('cha');
        sessionStorage.removeItem('profile');
        sessionStorage.removeItem('zip_file_permission')
        sessionStorage.removeItem('menuData')
        return Promise.resolve();
    },
    checkError: error => {
        const status = error.status;
        if (status === 408) {
            sessionStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        return sessionStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    },
    getPermissions: () => {
        const role = sessionStorage.getItem('permissions');
        return role ? Promise.resolve(role) : Promise.reject();
    }
};

export default authProvider;