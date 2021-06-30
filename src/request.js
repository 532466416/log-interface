import axios from "axios"

const server = axios.create({
    baseURL: "/api"
})

const taskId = function (params) {
    return server({
        url: '/list',
        method: 'get',
        params
    })
}
const taskDetail = function (params) {
    return server({
        url: '/details',
        method: 'get',
        params
    })
}
const taskStatus = function (params) {
    return server({
        url: '/sqldetail',
        method: 'get',
        params
    })
}
const jobFuzzy = function (params) {
    return server({
        url: '/fuzzyquery',
        method: 'get',
        params
    })
}
export default {
    taskId,
    taskDetail,
    taskStatus,
    jobFuzzy
}