import axios from "../axios";


//==================USER==========================//
const getAllUsers = (data) => {
    return axios.get(`/api/get-all-user?limit=${data.limit}&offset=${data.offset}`)

}
const createNewUser = (data) => {
    return axios.post(`/api/create-new-user`, data)

}
const UpdateUserService = (data) => {
    return axios.put(`/api/update-user`, data)

}
const BanUserService = (userId) => {
    return axios.post(`/api/ban-user`, {
        data: {
            id: userId
        }
    })

}

const UnbanUserService = (userId) => {
    return axios.post(`/api/unban-user`, {
        data: {
            id: userId
        }
    })

}
const checkUserPhoneService = (phonenumber) => {
    return axios.get(`/api/check-phonenumber-user?phonenumber=${phonenumber}`)
}
const changePasswordByphone = (data) => {
    return axios.post(`/api/changepasswordbyPhone`,data)
}
const getDetailUserById = (id) => {
    return axios.get(`/api/get-detail-user-by-id?id=${id}`)

}
const handleLoginService = (data) => {
    return axios.post(`/api/login`, data)

}

const handleChangePassword = (data) => {
    return axios.post(`/api/changepassword`, data)
}

//===============ALL CODE========================//
const getAllCodeService = (type) => {
    return axios.get(`/api/get-all-code?type=${type}`)

}
const getListAllCodeService = (data) => {
    return axios.get(`/api/get-list-allcode?type=${data.type}&limit=${data.limit}&offset=${data.offset}`)

}

const getListJobTypeAndCountPost = (data) => {
    return axios.get(`/api/get-list-job-count-post?limit=${data.limit}&offset=${data.offset}`)

}

const createAllCodeService = (data) => {
    return axios.post(`/api/create-new-all-code`, data)

}

const getDetailAllcodeByCode = (code) => {
    return axios.get(`/api/get-detail-all-code-by-code?code=${code}`)

}
const UpdateAllcodeService = (data) => {
    return axios.put(`/api/update-all-code`, data)

}
const DeleteAllcodeService = (allcodeId) => {
    return axios.delete(`/api/delete-all-code`, {
        data: {
            code: allcodeId
        }
    })
}
//================================== COMPANY ============================
const createCompanyService = (data) => {
    return axios.post(`/api/create-new-company`, data)

}
const getDetailCompanyByUserId = (userId) => {
    return axios.get(`/api/get-detail-company-by-userId?userId=${userId}`)

}
const getDetailCompanyById = (id) => {
    return axios.get(`/api/get-detail-company-by-id?id=${id}`)

}
const updateCompanyService = (data) => {
    return axios.put(`/api/update-company`, data)

}
const RecruitmentService = (data) => {
    return axios.put(`/api/add-user-company`, data)

}
const getAllUserByCompanyIdService = (data) => {
    return axios.get(`/api/get-all-user-by-companyId?companyId=${data.companyId}&limit=${data.limit}&offset=${data.offset}`)

}
const QuitCompanyService = (data) => {
    return axios.put(`/api/quit-company`, data)

}
const getListCompany = (data) => {
    return axios.get(`/api/get-list-company?limit=${data.limit}&offset=${data.offset}`)

}
//======================== POST ====================================//

const createPostService = (data) => {
    return axios.post(`/api/create-new-post`, data)

}
const updatePostService = (data) => {
    return axios.put(`/api/update-post`, data)

}
const activePostService = (data) => {
    return axios.put(`/api/active-post`, data)

}
const banPostService = (data) => {
    return axios.put(`/api/ban-post`, data)
}
const acceptPostService = (data) => {
    return axios.put(`/api/accept-post`, data)
}
const getAllPostByAdminService = (data) => {
    return axios.get(`/api/get-list-post-admin?companyId=${data.companyId}&limit=${data.limit}&offset=${data.offset}`)

}
const getAllPostByRoleAdminService = (data) => {
    return axios.get(`/api/get-all-post-admin?limit=${data.limit}&offset=${data.offset}`)

}
const getDetailPostByIdService = (id) => {
    return axios.get(`/api/get-detail-post-by-id?id=${id}`)
}
const getListPostService = (data) => {
    if (data.isHot === 1)
    {
        return axios.get(`/api/get-filter-post?limit=${data.limit}&offset=${data.offset}&categoryJobCode=${data.categoryJobCode}&addressCode=${data.addressCode}&salaryJobCode=${data.salaryJobCode}&categoryJoblevelCode=${data.categoryJoblevelCode}&categoryWorktypeCode=${data.categoryWorktypeCode}&experienceJobCode=${data.experienceJobCode}&sortName=${data.sortName}&isHot=${data.isHot}`)

    }
    return axios.get(`/api/get-filter-post?limit=${data.limit}&offset=${data.offset}&categoryJobCode=${data.categoryJobCode}&addressCode=${data.addressCode}&salaryJobCode=${data.salaryJobCode}&categoryJoblevelCode=${data.categoryJoblevelCode}&categoryWorktypeCode=${data.categoryWorktypeCode}&experienceJobCode=${data.experienceJobCode}&sortName=${data.sortName}`)
}

const getStatisticalTypePost = (limit) => {
    return axios.get(`/api/get-statistical-post?limit=${limit}`)
}

const getListNoteByPost = (data) => {
    return axios.get(`/api/get-note-by-post?limit=${data.limit}&offset=${data.offset}&id=${data.id}`)
}
//======================== PACKAGE ====================================//
const getPackageByType = (isHot) => {
    return axios.get(`/api/get-package-by-type?isHot=${isHot}`)
}

const getPackageById = (id) => {
    return axios.get(`/api/get-package-by-id?id=${id}`)
}

const getPaymentLink = (id,amount) => {
    return axios.get(`/api/get-payment-link?id=${id}&amount=${amount}`)
}

const paymentOrderSuccessService = (data) => {
    return axios.post(`/api/payment-success`, data)
}

const getAllPackage = (data) => {
    return axios.get(`/api/get-all-package?limit=${data.limit}&offset=${data.offset}`)
}

const setActiveTypePackage= (data) => {
    return axios.put(`/api/set-active-package-post`, data)
}

const createPackagePost= (data) => {
    return axios.post(`/api/create-package-post`, data)
}

const updatePackagePost = (data) => {
    return axios.put(`/api/update-package-post`, data)
}

const getStatisticalPackagePost = (data) => {
    return axios.get(`/api/get-statistical-package?limit=${data.limit}&offset=${data.offset}&fromDate=${data.fromDate}&toDate=${data.toDate}`)
}

export {
    DeleteAllcodeService, UpdateAllcodeService, getDetailAllcodeByCode, createAllCodeService, getListAllCodeService, getAllCodeService,
    getAllUsers, createNewUser, UpdateUserService, BanUserService,UnbanUserService, getDetailUserById, handleChangePassword, handleLoginService,
    createCompanyService, getDetailCompanyByUserId, updateCompanyService, RecruitmentService, getAllUserByCompanyIdService, QuitCompanyService,
    createPostService, updatePostService, banPostService,acceptPostService, getAllPostByAdminService,getAllPostByRoleAdminService, getDetailPostByIdService, activePostService, checkUserPhoneService, getListPostService,
    getListJobTypeAndCountPost, getListCompany, getDetailCompanyById,changePasswordByphone,getStatisticalTypePost , getPackageByType, getPaymentLink , paymentOrderSuccessService , getAllPackage ,
    setActiveTypePackage , createPackagePost , getPackageById , updatePackagePost , getStatisticalPackagePost,
    getListNoteByPost
}