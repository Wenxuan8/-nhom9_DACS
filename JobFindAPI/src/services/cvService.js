import db from "../models/index";
const { Op, and } = require("sequelize");

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
                        {
                            model: db.User, as: 'userCvData', attributes: {
                                exclude: ['userId', 'file', 'companyId']
                            },
                            include: [
                                {
                                    model: db.Account, as: 'userAccountData', attributes: {
                                        exclude: ['password']
                                    }
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
                        {
                            model: db.User, as: 'userCvData',
                            attributes: {
                                exclude: ['userId', 'file', 'companyId']
                            }
                        }
                    ]
                })
                cv.isChecked = 1
                await cv.save()
                if (cv.file) {
                    cv.file = new Buffer(cv.file, 'base64').toString('binary');
                }

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
                        {
                            model: db.Post, as: 'postCvData',
                            include: [
                                {
                                    model: db.DetailPost, as: 'postDetailData', attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown', 'amount'],
                                    include: [
                                        { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                                        { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                                        { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                                        { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                                        { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                                        { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                                        { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] }
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

let getStatisticalCv = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.fromDate || !data.toDate  || !data.companyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            }
            let company = await db.Company.findOne({
                where: { id: data.companyId }
            })
            if (company) {
                let listUserOfCompany = await db.User.findAll({
                    where: { companyId: company.id },
                    attributes: ['id'],
                })
                listUserOfCompany = listUserOfCompany.map(item => {
                    return {
                        userId: item.id
                    }
                })
                let listPost = await db.Post.findAndCountAll({
                    where: {
                        [Op.and]: [{ [Op.or]: listUserOfCompany }]
                    },
                    include: [
                        {
                            model: db.User, as: 'userPostData',
                            attributes: {
                                exclude: ['userId']
                            }
                        },
                        {
                            model: db.DetailPost, as: 'postDetailData',
                            attributes: {
                                exclude: ['statusCode']
                            }
                        }
                    ],
                    nest: true,
                    raw: true,
                    limit: +data.limit,
                    offset: +data.offset,
                    order: [['createdAt', 'ASC']]
                })
                let listPostId = listPost.rows.map(item =>
                ({
                    postId: item.id
                })
                )

                let listCv = await db.Cv.findAll({
                    where: {
                        createdAt: { [Op.and]: [{ [Op.gte]: `${data.fromDate} 00:00:00` }, { [Op.lte]: `${data.toDate} 23:59:59` }] },
                        [Op.and]: [{ [Op.or]: listPostId }]
                    },
                    attributes: ['postId', [db.sequelize.fn('COUNT', db.sequelize.col('postId')), 'total']],
                    group: ['postId']
                })
                listPost.rows = listPost.rows.map(post => {
                    let count = 1
                    let length = listCv.length
                    if (length == 0) {
                        return {
                            ...post,
                            total: 0
                        }
                    }
                    for (let cv of listCv) {
                        if (cv.postId == post.id) {
                            return {
                                ...post,
                                total: cv.total
                            }
                        }
                        else if (count == length) {
                            return {
                                ...post,
                                total: 0
                            }
                        }
                        count++
                    }
                }
                )
                resolve({
                    errCode: 0,
                    data: listPost.rows,
                    count: listPost.count
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy công ty'
                })
            }
        }
        catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleCreateCv: handleCreateCv,
    getAllListCvByPost: getAllListCvByPost,
    getDetailCvById: getDetailCvById,
    getAllCvByUserId: getAllCvByUserId,
    getStatisticalCv: getStatisticalCv
}