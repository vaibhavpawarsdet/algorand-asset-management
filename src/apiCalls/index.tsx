import { stringify } from 'query-string';
import { fetchUtils, DataProvider } from 'ra-core';


// React Admin Api calls
export default (apiUrl:string, httpClient = fetchUtils.fetchJson): DataProvider => ({
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        var query = {
            sort: encodeURI(JSON.stringify([field, order])),
            range: encodeURI(JSON.stringify([(page - 1) * perPage, page * perPage - 1])),
            filter: encodeURI(JSON.stringify(params.filter)),
        };
       
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
       
        const { headers, json } = await httpClient(url);
        if (!headers.has('content-range')) {
            throw new Error(
                'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
            );
        }
        let headString: string = headers.get('content-range')?.split('/').pop() || '';
        return {
            data: json,
            total: parseInt(headString, 10),
        };
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: async (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url);
        return ({ data: json });
    },

    getManyReference: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        const { headers, json } = await httpClient(url);
        if (!headers.has('content-range')) {
            throw new Error(
                'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
            );
        }
        let headString: string = headers.get('content-range')?.split('/').pop() || '';
        return {
            data: json,
            total: parseInt(headString, 10),
        };
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    // simple-rest doesn't handle provide an updateMany route, so we fallback to calling update n times instead
    updateMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                })
            )
        ).then(responses => ({ data: responses.map(({ json }) => json.id) })),

    create: (resource, params:any) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    deleteMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'DELETE',
                })
            )
        ).then(responses => ({ data: responses.map(({ json }) => json.id) })),
});


