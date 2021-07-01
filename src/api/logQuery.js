import request from '../utils/request';

export function typeObtain() {
    return request({
        url: 'dblogs/listContainers',
        method: 'get'
    });
}

export function logObtain(params) {
    return request({
        url: '/dblogs/logDetails',
        method: 'get',
        params
    });
}

export function contextObtain(params) {
    return request({
        url: 'dblogs/searchUpAndDown',
        method: 'get',
        params
    });
}