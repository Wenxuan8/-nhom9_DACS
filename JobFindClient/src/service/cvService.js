import axios from "../axios";


//==================CV==========================//
const createNewCv = (data) => {
    return axios.post(`/api/create-new-cv`, data)
}
const getAllListCvByPostService = (data) => {
    return axios.get(`/api/get-all-list-cv-by-post?limit=${data.limit}&offset=${data.offset}&postId=${data.postId}`)
}
const getDetailCvService = (id) => {
    return axios.get(`/api/get-detail-cv-by-id?cvId=${id}`)
}
const getAllListCvByUserIdService = (data) => {
    return axios.get(`/api/get-all-cv-by-userId?limit=${data.limit}&offset=${data.offset}&userId=${data.userId}`)
}

const getStatisticalCv = (data) => {
    return axios.get(`/api/get-statistical-cv?limit=${data.limit}&offset=${data.offset}&fromDate=${data.fromDate}&toDate=${data.toDate}&companyId=${data.companyId}`)
}
export {
    createNewCv, getAllListCvByPostService, getDetailCvService, getAllListCvByUserIdService, getStatisticalCv
}