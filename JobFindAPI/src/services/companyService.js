const { Op, and } = require("sequelize");
import e from "express";
import db from "../models/index";
const cloudinary = require('../utils/cloudinary');

let checkCompany = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!name) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let company = await db.Company.findOne({
                    where: { name: name }
                })
                if (company) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }


        } catch (error) {
            reject(error)
        }
    })
}

let checkUserPhone = (userPhone) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userPhone) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let account = await db.Account.findOne({
                    where: { phonenumber: userPhone }
                })
                if (account) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }


        } catch (error) {
            reject(error)
        }
    })
}

let handleCreateNewCompany = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.phonenumber || !data.address 
                || !data.descriptionHTML || !data.descriptionMarkdown 
                || !data.amountEmployer || !data.userId || data.censorCode) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                if (checkCompany(data.name))
                {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tên công ty đã tồn tại'
                    })
                }
                else{
                    let thumbnailUrl = ""
                    let coverimageUrl = ""
                    if (data.thumbnail && data.coverimage) {
    
                        const uploadedThumbnailResponse = await cloudinary.uploader.upload(data.thumbnail, {
                            upload_preset: 'dev_setups'
                        })
                        const uploadedCoverImageResponse = await cloudinary.uploader.upload(data.coverimage, {
                            upload_preset: 'dev_setups'
                        })
                        thumbnailUrl = uploadedThumbnailResponse.url
                        coverimageUrl = uploadedCoverImageResponse.url
                    }
    
    
                    let company = await db.Company.create({
                        name: data.name,
                        thumbnail: thumbnailUrl,
                        coverimage: coverimageUrl,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown,
                        website: data.website,
                        address: data.address,
                        phonenumber: data.phonenumber,
                        amountEmployer: data.amountEmployer,
                        taxnumber: data.taxnumber,
                        statusCode: 'S1',
                        userId: data.userId,
                        censorCode: data.censorCode,
                        file: data.file ? data.file : null
                    })
                    let user = await db.User.findOne({
                        where: { id: data.userId },
                        raw: false,
                        attributes: {
                            exclude: ['userId']
                        }
                    })
    
                    let account= await db.Account.findOne({
                        where: {userId: data.userId},
                        raw: false
                    })
                    
                    if (user && account) {
                        user.companyId = company.id
                        await user.save()
                        account.roleCode = 'COMPANY'
                        await account.save()
                        resolve({
                            errCode: 0,
                            errMessage: 'Đã tạo công ty thành công'
                        })
                    }
                    else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Không tìm thấy người dùng'
                        })
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleUpdateCompany = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.phonenumber || !data.address || !data.descriptionHTML || !data.descriptionMarkdown || !data.amountEmployer) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                if (checkCompany(data.name))
                {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tên công ty đã tồn tại'
                    })
                }
                else {

                    let res = await db.Company.findOne({
                        where: {
                            id: data.id
                        },
                        raw: false
                    })
                    if (res) {
                        if (data.thumbnail) {
                            let thumbnailUrl = ""
                            const uploadedThumbnailResponse = await cloudinary.uploader.upload(data.thumbnail, {
                                upload_preset: 'dev_setups'
                            })
                            thumbnailUrl = uploadedThumbnailResponse.url
                            res.thumbnail = thumbnailUrl
                        }
                        if (data.coverimage) {
                            let coverImageUrl = ""
                            const uploadedcoverImageResponse = await cloudinary.uploader.upload(data.coverimage, {
                                upload_preset: 'dev_setups'
                            })
                            coverImageUrl = uploadedcoverImageResponse.url
                            res.coverimage = coverImageUrl
                        }
    
                        res.name = data.name
                        res.descriptionHTML = data.descriptionHTML
                        res.descriptionMarkdown = data.descriptionMarkdown
                        res.website = data.website
                        res.address = data.address
                        res.amountEmployer = data.amountEmployer
                        res.taxnumber = data.taxnumber
                        res.phonenumber = data.phonenumber
                        res.file = data.file ? data.file : null
                        await res.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Đã sửa thông tin công ty thành công'
                        })
                    }
                    else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Không tìm thấy công ty'
                        })
                    }
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleBanCompany = (companyId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!companyId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundCompany = await db.Company.findOne({
                    where: { id: companyId },
                    raw: false
                })
                if (!foundCompany) {
                    resolve({
                        errCode: 2,
                        errMessage: `Công ty không tồn tại`
                    })
                }
                foundCompany.statusCode = 'S2'
                await foundCompany.save()
                resolve({
                    errCode: 0,
                    message: `Đã dừng hoạt động công ty`
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleUnBanCompany = (companyId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!companyId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundCompany = await db.Company.findOne({
                    where: { id: companyId },
                    raw: false
                })
                if (!foundCompany) {
                    resolve({
                        errCode: 2,
                        errMessage: `Công ty không tồn tại`
                    })
                }
                else{
                    foundCompany.statusCode = 'S1'
                    await foundCompany.save()
                    resolve({
                        errCode: 0,
                        message: `Đã mở hoạt động cho công ty`
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleAddUserCompany = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.phonenumber || !data.companyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let company = await db.Company.findOne({where: {id: data.companyId}})
                if (company)
                {
                    let isExist = await checkUserPhone(data.phonenumber);
                    if (isExist) {
                        let account = await db.Account.findOne({
                            where: {
                                phonenumber: data.phonenumber
                            },
                            raw: false
                        })
                        if(account.roleCode != 'EMPLOYER'){
                            resolve({
                                errCode: 1,
                                errMessage: 'Tài khoản không phải là nhà tuyển dụng'
                            })
                        }else {
                            let user = await db.User.findOne({
                                where: {id: account.userId},
                                attributes: {
                                    exclude: ['userId']
                                },
                                raw: false
                            })
                            if (user.companyId)
                            {
                                resolve({
                                    errCode: 3,
                                    errMessage: 'Nhân viên đã có công ty'
                                })
                            }
                            else {
                                user.companyId = data.companyId
                                await user.save()
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Đã thêm nhà tuyển dụng vào công ty'
                                })
                            }
                        }
    
                        
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Số điện thoại không tồn tại !'
                        })
                    }
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Công ty không tồn tại !'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getListCompany = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let company = await db.Company.findAndCountAll({
                    offset: +data.offset,
                    limit: +data.limit
                })
                resolve({
                    errCode: 0,
                    data: company.rows,
                    count: company.count
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailCompanyById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let company = await db.Company.findOne({
                    where: { id: id }
                })
                if (!company)
                {
                    resolve({
                        errCode: 0,
                        errorMessage: 'Không tồn tại công ty',
                    })
                } 
                else {
                    let listUserOfCompany = await db.User.findAll({
                        where: {companyId: company.id},
                        attributes: ['id'],
                    })
                    listUserOfCompany = listUserOfCompany.map(item=> {
                        return {
                            userId: item.id
                        }
                    })
                    company.postData = await db.Post.findAll({
                        where: {
                            [Op.or]: listUserOfCompany
                        },
                        order: [['createdAt', 'DESC']],
                        limit: 5,
                        offset: 0,
                        attributes: {
                            exclude: ['detailPostId']
                        },
                        nest: true,
                        raw: true,
                        include: [
                            {model: db.DetailPost,as:'userComapnyData',attributes: ['id','name','descriptionHTML','descriptionMarkdown','amount'],
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
                    })
                    resolve({
                        errCode: 0,
                        data: company,
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailCompanyByUserId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let company = await db.Company.findOne({
                    where: { userId: userId }
                })
                if (!company)
                {
                    resolve({
                        errCode: 2,
                        errMessage: "Không tìm thấy công ty người dùng sở hữu"    
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        data: company,
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllUserByCompanyId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset || !data.companyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {

                let res = await db.User.findAndCountAll({
                    where: { companyId: data.companyId },
                    limit: +data.limit,
                    offset: +data.offset,
                    attributes: {
                        exclude: ['password','userId']
                    },
                    include: [
                        { model: db.Allcode, as: 'genderData', attributes: ['value', 'code'] },
                    ],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: res.rows,
                    count: res.count
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleQuitCompany = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: data.userId,
                    },
                    attributes: {
                        exclude: ['userId']
                    },
                    raw: false
                })
                if (user) {
                    let account = await db.Account.findOne({
                        where: {userId: user.id}
                    })
                    if (account.roleCode == 'COMPANY')
                    {
                        account.roleCode == 'EMPLOYER'
                        await account.save()
                    }
                    user.companyId = null
                    await user.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Đã rời công ty thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Người dùng không tồn tại'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleCreateNewCompany: handleCreateNewCompany,
    handleUpdateCompany: handleUpdateCompany,
    handleBanCompany: handleBanCompany,
    handleUnBanCompany: handleUnBanCompany,
    handleAddUserCompany: handleAddUserCompany,
    getListCompany: getListCompany,
    getDetailCompanyById: getDetailCompanyById,
    getDetailCompanyByUserId: getDetailCompanyByUserId,
    getAllUserByCompanyId: getAllUserByCompanyId,
    handleQuitCompany: handleQuitCompany
}