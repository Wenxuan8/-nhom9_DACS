import db from "../models/index";
const { Op, and } = require("sequelize");

let handleCreateNewPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.categoryJobCode || !data.addressCode || !data.salaryJobCode || !data.amount || !data.timeEnd || !data.categoryJoblevelCode || !data.companyId
                || !data.categoryWorktypeCode || !data.experienceJobCode || !data.genderCode || !data.descriptionHTML || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                await db.Post.create({
                    name: data.name,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    statusCode: "S1",
                    categoryJobCode: data.categoryJobCode,
                    addressCode: data.addressCode,
                    salaryJobCode: data.salaryJobCode,
                    amount: data.amount,
                    timeEnd: data.timeEnd,
                    categoryJoblevelCode: data.categoryJoblevelCode,
                    categoryWorktypeCode: data.categoryWorktypeCode,
                    experienceJobCode: data.experienceJobCode,
                    genderPostCode: data.genderCode,
                    companyId: data.companyId,

                })

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleUpdatePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.categoryJobCode || !data.addressCode || !data.salaryJobCode || !data.amount || !data.timeEnd || !data.categoryJoblevelCode
                || !data.categoryWorktypeCode || !data.experienceJobCode || !data.genderCode || !data.descriptionHTML || !data.descriptionMarkdown || !data.id
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let post = await db.Post.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (post) {
                    post.name = data.name
                    post.categoryJobCode = data.categoryJobCode
                    post.addressCode = data.addressCode
                    post.salaryJobCode = data.salaryJobCode
                    post.amount = data.amount
                    post.timeEnd = data.timeEnd
                    post.categoryJoblevelCode = data.categoryJoblevelCode
                    post.categoryWorktypeCode = data.categoryWorktypeCode
                    post.experienceJobCode = data.experienceJobCode
                    post.genderPostCode = data.genderCode
                    post.descriptionHTML = data.descriptionHTML
                    post.descriptionMarkdown = data.descriptionMarkdown

                    await post.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bài đăng không tồn tại !'
                    })
                }





            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleBanPost = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!postId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundPost = await db.Post.findOne({
                    where: { id: postId },
                    raw: false
                })
                if (foundPost) {
                    foundPost.statusCode = 'S2'
                    await foundPost.save()
                    resolve({
                        errCode: 0,
                        message: 'ok'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleActivePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundPost = await db.Post.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (foundPost) {
                    foundPost.statusCode = 'S1'
                    await foundPost.save()
                    resolve({
                        errCode: 0,
                        message: 'ok'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getListPostByAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset || !data.companyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let post = await db.Post.findAndCountAll({
                    offset: +data.offset,
                    limit: +data.limit,
                    where: { companyId: data.companyId },
                    include: [
                        { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'statusPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                    ],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: post.rows,
                    count: post.count
                })
            }
        } catch (error) {
            reject(error)
        }
    })


}
let getDetailPostById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let post = await db.Post.findOne({
                    where: { id: id, statusCode: 'S1' },
                    include: [
                        { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'statusPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                    ],
                    raw: true,
                    nest: true
                })
                let company = await db.Company.findOne({
                    where: { id: post.companyId }
                })
                post.companyData = company
                resolve({
                    errCode: 0,
                    data: post,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getFilterPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(typeof data.experienceJobCode)
            let objectFilter = ''
            if (data.salaryJobCode !== '' || data.categoryWorktypeCode !== '' || data.experienceJobCode !== '' || data.categoryJoblevelCode !== '') {
                let querySalaryJob = ''
                if (data.salaryJobCode !== '')
                    querySalaryJob = data.salaryJobCode.split(',').map((data, index) => {
                        return { salaryJobCode: data }
                    })

                let queryWorkType = ''
                if (data.categoryWorktypeCode !== '')
                    queryWorkType = data.categoryWorktypeCode.split(',').map((data, index) => {
                        return { categoryWorktypeCode: data }
                    })

                let queryExpType = ''
                if (data.experienceJobCode !== '')
                    queryExpType = data.experienceJobCode.split(',').map((data, index) => {
                        return { experienceJobCode: data }
                    })
                let queryJobLevel = ''
                if (data.categoryJoblevelCode !== '')
                    queryJobLevel = data.categoryJoblevelCode.split(',').map((data, index) => {
                        return { categoryJoblevelCode: data }
                    })
                objectFilter = {
                    where: {
                        statusCode: 'S1',
                        [Op.and]: [
                            queryExpType && { [Op.or]: [...queryExpType] },
                            queryWorkType && { [Op.or]: [...queryWorkType] },
                            querySalaryJob && { [Op.or]: [...querySalaryJob] },
                            queryJobLevel && { [Op.or]: [...queryJobLevel] }
                        ]
                    },
                    include: [
                        { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'statusPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                    ],
                    order: [["createdAt", "DESC"]],
                    raw: true,
                    nest: true
                }
            }
            else {
                objectFilter = {
                    where: { statusCode: 'S1' },
                    include: [
                        { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'statusPostData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                    ],
                    order: [["createdAt", "DESC"]],
                    raw: true,
                    nest: true
                }
            }
            if (data.limit && data.offset) {
                objectFilter.limit = +data.limit
                objectFilter.offset = +data.offset
            }
            if (data.categoryJobCode && data.categoryJobCode !== '') objectFilter.where = { ...objectFilter.where, categoryJobCode: data.categoryJobCode }
            if (data.addressCode && data.addressCode !== '') objectFilter.where = { ...objectFilter.where, addressCode: data.addressCode }
            // if (data.salaryJobCode && data.salaryJobCode !== '') objectFilter.where = { ...objectFilter.where, salaryJobCode: data.salaryJobCode }
            // if (data.categoryJoblevelCode && data.categoryJoblevelCode !== '') objectFilter.where = { ...objectFilter.where, categoryJoblevelCode: data.categoryJoblevelCode }
            // if (data.categoryWorktypeCode && data.categoryWorktypeCode !== '') objectFilter.where = { ...objectFilter.where, categoryWorktypeCode: data.categoryWorktypeCode }
            // if (data.experienceJobCode && data.experienceJobCode !== '') objectFilter.where = { ...objectFilter.where, experienceJobCode: data.experienceJobCode }
            if (data.sortName === "true") objectFilter.order = [["name", "DESC"]]


            let res = await db.Post.findAndCountAll(objectFilter)

            for (let i = 0; i < res.rows.length; i++) {
                res.rows[i].company = await db.Company.findOne({ where: { id: res.rows[i].companyId } })
            }

            resolve({
                errCode: 0,
                data: res.rows,
                count: res.count
            })


        } catch (error) {
            reject(error)
        }
    })
}

let getStatisticalTypePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Post.findAll({
                where: {
                    statusCode: 'S1'
                },
                include: [
                    { model: db.Allcode, as: 'jobTypePostData', attributes: ['value'] },
                ],
                attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('categoryJobCode')), 'amount']],
                group: ['categoryJobCode'],
                order: [["amount", "ASC"]],
                limit: +data.limit,
                raw: true,
                nest: true
            })

            let totalPost = await db.Post.findAndCountAll({
                where: {
                    statusCode: 'S1'
                },
            })
            resolve({
                errCode: 0,
                data: res,
                totalPost: totalPost.count
            })
        }
        catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    handleCreateNewPost: handleCreateNewPost,
    handleUpdatePost: handleUpdatePost,
    handleBanPost: handleBanPost,
    getListPostByAdmin: getListPostByAdmin,
    getDetailPostById: getDetailPostById,
    handleActivePost: handleActivePost,
    getFilterPost: getFilterPost,
    getStatisticalTypePost: getStatisticalTypePost,
}