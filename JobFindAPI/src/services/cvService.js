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
                await db.Cv.create({
                    userId: data.userId,
                    file: data.file,
                    postId: data.postId,
                    isChecked: 0,
                    description: data.description
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
                    raw: true,
                    attributes: {
                        exclude: ['file']
                    },
                })
                for (let i = 0; i < cv.rows.length; i++) {
                    cv.rows[i].userData = await db.User.findOne({
                        where: { id: cv.rows[i].userId }
                    })
                    if (cv.rows[i].isChecked == 1) {
                        cv.rows[i].isChecked == true
                    } else cv.rows[i].isChecked == false
                }
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
                    raw: false
                })
                let userData = await db.User.findOne({ where: { id: cv.userId } })
                cv.isChecked = 1

                if (cv.file) {
                    cv.file = new Buffer(cv.file, 'base64').toString('binary');
                }

                await cv.save()

                resolve({
                    errCode: 0,
                    data: cv,
                    userData: userData
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
                })
                for (let i = 0; i < cv.rows.length; i++) {
                    cv.rows[i].postData = await db.Post.findOne({
                        where: { id: cv.rows[i].postId },
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
                }
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
module.exports = {
    handleCreateCv: handleCreateCv,
    getAllListCvByPost: getAllListCvByPost,
    getDetailCvById: getDetailCvById,
    getAllCvByUserId: getAllCvByUserId
}