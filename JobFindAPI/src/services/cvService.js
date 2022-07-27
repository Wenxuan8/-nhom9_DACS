import db from "../models/index";

let handleCreateCv = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.file || !data.postId || !data.description) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let cv = await db.Cv.create({
                    userId: data.userId,
                    file: data.file,
                    postId: data.postId,
                    isChecked: 0,
                    description: data.description
                })
                if (cv) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Đã gửi CV thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Đã gửi CV thất bại'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllListCvByPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.postId || !data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let cv = await db.Cv.findAndCountAll({
                    where: { postId: data.postId },
                    limit: +data.limit,
                    offset: +data.offset,
                    nest: true,
                    raw: true,
                    attributes: {
                        exclude: ['file']
                    },
                    include: [
                        {model: db.User, as:'userCvData',attributes: {
                            exclude: ['userId','file','companyId']
                            },
                            include: [
                                {model: db.Account, as:'userAccountData', attributes: {
                                    exclude: ['password']
                                } }
                            ]
                        }
                    ]
                })
                resolve({
                    errCode: 0,
                    data: cv.rows,
                    count: cv.count
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailCvById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.cvId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let cv = await db.Cv.findOne({
                    where: { id: data.cvId },
                    raw: false,
                    nest: true,
                    include: [
                        {model: db.User, as:'userCvData',
                            attributes: {
                                exclude: ['userId','file','companyId']
                            }
                        }
                    ]
                })
                cv.isChecked = 1
                if (cv.file) {
                    cv.file = new Buffer(cv.file, 'base64').toString('binary');
                }

                await cv.save()

                resolve({
                    errCode: 0,
                    data: cv,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllCvByUserId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let cv = await db.Cv.findAndCountAll({
                    where: { userId: data.userId },
                    limit: +data.limit,
                    offset: +data.offset,
                    raw: true,
                    nest: true,
                    include: [
                        {model: db.Post, as:'postCvData',
                            include: [
                                {model: db.DetailPost,as:'postDetailData',attributes: ['id','name','descriptionHTML','descriptionMarkdown','amount'],
                                    include: [
                                        {model: db.Allcode, as:'jobTypePostData' , attributes: ['value','code']},
                                        {model: db.Allcode, as:'workTypePostData' , attributes: ['value','code']},
                                        {model: db.Allcode, as:'salaryTypePostData' , attributes: ['value','code']},
                                        {model: db.Allcode, as:'jobLevelPostData' , attributes: ['value','code']},
                                        {model: db.Allcode, as:'genderPostData' , attributes: ['value','code']},
                                        {model: db.Allcode, as:'provincePostData' , attributes: ['value','code']},
                                        {model: db.Allcode, as:'expTypePostData' , attributes: ['value','code']}
                                    ]
                                }
                            ]
                        }
                    ]
                })
                resolve({
                    errCode: 0,
                    data: cv.rows,
                    count: cv.count
                })
            }
        } catch (error) {
            reject(error.message)
        }
    })
}
module.exports = {
    handleCreateCv: handleCreateCv,
    getAllListCvByPost: getAllListCvByPost,
    getDetailCvById: getDetailCvById,
    getAllCvByUserId: getAllCvByUserId
}