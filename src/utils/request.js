import axios from "axios"
import {
    Message
} from 'element-ui'

const service = axios.create({
    // baseURL: "/api"
})

service.interceptors.response.use(response => {
    if (response.status === 200) {
        return response.data
    } else {
        console.log(response);
    }
}, error => {
    Message({
        message: error.message,
        type: 'error'
    })
    return Promise.reject(error.message)
})

export default service