import db from "../models/index";
import bcrypt from "bcryptjs";
const cloudinary = require('../utils/cloudinary');
const salt = bcrypt.genSaltSync(10);

let hashUserPasswordFromBcrypt = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
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
let handleCreateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.phonenumber || !data.lastName || !data.firstName || !data.password) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let check = await checkUserPhone(data.phonenumber);
                if (check) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Số điện thoại đã tồn tại !'
                    })
                } else {
                    let imageUrl = ""
                    let hashPassword = await hashUserPasswordFromBcrypt(data.password);
                    if (data.image) {
                        const uploadedResponse = await cloudinary.uploader.upload(data.image, {
                            upload_preset: 'dev_setups'
                        })
                        imageUrl = uploadedResponse.url
                    }
                    let user = await db.User.create({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        genderCode: data.genderCode,
                        image: imageUrl,
                        dob: data.dob,
                        companyId: data.companyId
                    })
                    if (user)
                    {
                        await db.Account.create({
                            phonenumber: data.phonenumber,
                            password: hashPassword,
                            roleCode: data.roleCode,
                            statusCode: 'S1',
                            userId: user.id
                        })
                    }
                    resolve({
                        errCode: 0,
                        message: 'Tạo tài khoản thành công'
                    })
                }

            }

        } catch (error) {
            reject(error)
        }
    })
}

let banUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundUser = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['userId']
                    }
                })
                if (!foundUser) {
                    resolve({
                        errCode: 2,
                        errMessage: `Người dùng không tồn tại`
                    })
                }
                else{
                    let account = await db.Account.findOne({
                        where: {userId: userId},
                        raw: false
                    })
                    if (account)
                    {
                        account.statusCode = 'S2'
                        await account.save()
                        resolve({
                            errCode: 0,
                            message: `Người dùng đã ngừng kích hoạt`
                        })
                    }
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}

let unbanUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundUser = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['userId']
                    }
                })
                if (!foundUser) {
                    resolve({
                        errCode: 2,
                        errMessage: `Người dùng không tồn tại`
                    })
                }
                else{
                    let account = await db.Account.findOne({
                        where: {userId: userId},
                        raw: false
                    })
                    if (account)
                    {
                        account.statusCode = 'S1'
                        await account.save()
                        resolve({
                            errCode: 0,
                            message: `Người dùng đã kích hoạt`
                        })
                    }
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters`
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false,
                    attributes: {
                        exclude: ['userId']
                    }
                })
                let account = await db.Account.findOne({
                    where: {userId: data.id},
                    raw:false
                })
                if (user && account) {
                    user.firstName = data.firstName
                    user.lastName = data.lastName
                    user.address = data.address
                    user.genderCode = data.genderCode
                    user.dob = data.dob
                    if (data.image) {
                        let imageUrl = ""
                        const uploadedResponse = await cloudinary.uploader.upload(data.image, {
                            upload_preset: 'dev_setups'
                        })
                        imageUrl = uploadedResponse.url
                        user.image = imageUrl
                    }
                    await user.save();
                    account.roleCode = data.roleCode
                    await account.save();
                    resolve({
                        errCode: 0,
                        message: 'Đã chỉnh sửa thành công'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'User not found!'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let changePaswordByPhone = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let account = await db.Account.findOne({
                where: { phonenumber: data.phonenumber },
                raw: false
            })
            if (account) {
                account.password = await hashUserPasswordFromBcrypt(data.password);
                await account.save();
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
            else {
                resolve({
                    errCode:1,
                    errMessage: 'SĐT không tồn tại'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.phonenumber || !data.password) {
                resolve({
                    errCode: 4,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let userData = {};

                let isExist = await checkUserPhone(data.phonenumber);

                if (isExist) {
                    let account = await db.Account.findOne({
                        where: { phonenumber: data.phonenumber },
                        raw: true
                    })
                    if (account) {
                        let check = await bcrypt.compareSync(data.password, account.password);
                        if (check) {
                            if (account.statusCode == 'S1')
                            {
                                let user = await db.User.findOne({
                                    attributes: {
                                        exclude: ['userId']
                                    },
                                    where: {id: account.userId  },
                                    raw: true
                                })
                                user.roleCode = account.roleCode
                                userData.errMessage = 'Ok';
                                userData.errCode = 0;
                                userData.user= user;
                            }
                            else {
                                userData.errCode = 1;
                                userData.errMessage = 'Tài khoản của bạn đã bị khóa';
                            }
                        }
                        else {
                            userData.errCode = 2;
                            userData.errMessage = 'Số điện thoại hoặc mật khẩu không chính xác';
                        }
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'User not found!'
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `Số điện thoại hoặc mật khẩu không chính xác`
                }
                resolve(userData)
            }


        } catch (error) {
            reject(error)
        }
    })
}
let handleChangePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.password || !data.oldpassword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let account = await db.Account.findOne({
                    where: { userId: data.id },
                    raw: false
                })
                if (await bcrypt.compareSync(data.oldpassword, account.password)) {
                    if (account) {
                        account.password = await hashUserPasswordFromBcrypt(data.password);
                        await account.save();
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Mật khẩu cũ không chính xác'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {

                let res = await db.Account.findAndCountAll({
                    limit: +data.limit,
                    offset: +data.offset,
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'roleData' ,attributes: ['code','value'] }, 
                        { model: db.Allcode, as: 'statusAccountData',attributes: ['code','value']},
                        { model: db.User, as: 'userAccountData', attributes: {
                            exclude: ['userId']
                        },
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['value', 'code'] },
                            ]
                        }
                    ],
                    raw: true,
                    nest: true,
                })
                resolve({
                    errCode: 0,
                    data: res.rows,
                    count: res.count
                })
            }

        } catch (error) {
            reject(error.message)
        }
    })
}
let getDetailUserById = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userid) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let res = await db.Account.findOne({
                    where: { userId: userid, statusCode: 'S1' },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'roleData', attributes: ['value', 'code'] },
                        { model: db.User, as: 'userAccountData', attributes: {
                            exclude: ['userId']
                        },
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['value', 'code'] },
                            ]
                    }
                    ],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: res
                })
            }
        } catch (error) {
            reject(error.message)
        }
    })
}


module.exports = {
    handleCreateNewUser: handleCreateNewUser,
    banUser: banUser,
    unbanUser: unbanUser,
    updateUserData: updateUserData,
    handleLogin: handleLogin,
    handleChangePassword: handleChangePassword,
    getAllUser: getAllUser,
    getDetailUserById: getDetailUserById,
    checkUserPhone: checkUserPhone, changePaswordByPhone
}