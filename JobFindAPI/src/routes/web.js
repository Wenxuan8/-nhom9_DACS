import express from "express";
import userController from '../controllers/userController';
import allcodeController from '../controllers/allcodeController';
import companyController from '../controllers/companyController';
import postController from '../controllers/postController';
import cvController from '../controllers/cvController'
import packageController from '../controllers/packagePostController'
let router = express.Router();

let initWebRoutes = (app) => {

    //=====================API USER==========================//
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/update-user', userController.handleUpdateUser)
    router.post('/api/ban-user', userController.handleBanUser)
    router.post('/api/unban-user', userController.handleUnbanUser)
    router.post('/api/login', userController.handleLogin)
    router.post('/api/changepassword', userController.handleChangePassword)
    router.get('/api/get-all-user', userController.getAllUser)
    router.get('/api/get-detail-user-by-id', userController.getDetailUserById)
    router.get('/api/check-phonenumber-user', userController.checkUserPhone)
    router.post('/api/changepasswordbyPhone', userController.changePaswordByPhone)

    //===================API ALLCODE========================//
    router.post('/api/create-new-all-code', allcodeController.handleCreateNewAllCode)
    router.put('/api/update-all-code', allcodeController.handleUpdateAllCode)
    router.delete('/api/delete-all-code', allcodeController.handleDeleteAllCode)
    router.get('/api/get-all-code', allcodeController.getAllCodeService)
    router.get('/api/get-list-allcode', allcodeController.getListAllCodeService)
    router.get('/api/get-detail-all-code-by-code', allcodeController.getDetailAllcodeByCode)
    router.get('/api/get-list-job-count-post', allcodeController.getListJobTypeAndCountPost)
    //==================API COMPANY=========================//
    router.post('/api/create-new-company', companyController.handleCreateNewCompany)
    router.put('/api/update-company', companyController.handleUpdateCompany)
    router.put('/api/ban-company', companyController.handleBanCompany)
    router.put('/api/unban-company', companyController.handleUnBanCompany)
    router.put('/api/add-user-company', companyController.handleAddUserCompany)
    router.get('/api/get-list-company', companyController.getListCompany)
    router.get('/api/get-detail-company-by-id', companyController.getDetailCompanyById)
    router.get('/api/get-detail-company-by-userId', companyController.getDetailCompanyByUserId)
    router.get('/api/get-all-user-by-companyId', companyController.getAllUserByCompanyId)
    router.put('/api/quit-company', companyController.handleQuitCompany)

    //==================API CV==========================//
    router.post('/api/create-new-cv', cvController.handleCreateNewCV)
    router.get('/api/get-all-list-cv-by-post', cvController.getAllListCvByPost)
    router.get('/api/get-detail-cv-by-id', cvController.getDetailCvById)
    router.get('/api/get-all-cv-by-userId', cvController.getAllCvByUserId)
    router.get('/api/get-statistical-cv', cvController.getStatisticalCv)    
    //==================API POST==========================//
    router.post('/api/create-new-post', postController.handleCreateNewPost)
    router.put('/api/update-post', postController.handleUpdatePost)
    router.put('/api/active-post', postController.handleActivePost)
    router.put('/api/ban-post', postController.handleBanPost)
    router.put('/api/accept-post', postController.handleAcceptPost)
    router.get('/api/get-list-post-admin', postController.getListPostByAdmin)
    router.get('/api/get-all-post-admin', postController.getAllPostByAdmin)
    router.get('/api/get-detail-post-by-id', postController.getDetailPostById)
    router.get('/api/get-filter-post', postController.getFilterPost)
    router.get('/api/get-statistical-post', postController.getStatisticalTypePost)

    //==================API PACKAGE==========================//
    router.get('/api/get-package-by-type', packageController.getPackageByType)
    router.get('/api/get-package-by-id', packageController.getPackageById)
    router.get('/api/get-payment-link', packageController.getPaymentLink)
    router.get('/api/get-all-package', packageController.getAllPackage)
    router.post('/api/payment-success', packageController.paymentOrderSuccess)
    router.put('/api/set-active-package-post', packageController.setActiveTypePackage)
    router.post('/api/create-package-post', packageController.creatNewPackagePost)
    router.put('/api/update-package-post', packageController.updatePackagePost)
    router.get('/api/get-statistical-package', packageController.getStatisticalPackage)
    return app.use("/", router);
}

module.exports = initWebRoutes;