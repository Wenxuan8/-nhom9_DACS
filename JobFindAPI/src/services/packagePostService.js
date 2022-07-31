import db from "../models/index";
const { Op, and } = require("sequelize");
import paypal from 'paypal-rest-sdk'
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'ARulk2xnPxfzBhbH4DrZsANY3Pm80t4Prbw4AfaEI1kgtCH3Nzz__h2Fa8FFph8DsD9ZPZpN8d6tdahJ',
    'client_secret': 'EAcDSFu6gZjU52EhjvIGUYQz0d2XlEGk4PiJfTj8y23uTrZtesIPElfNKY9AcndkmtdSDCZQP7TaqcEn'
});
let getPackageByType = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.isHot === '') {
                resolve({   
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let packagePost = await db.PackagePost.findAll({
                    where: { isHot: data.isHot }
                })
                resolve({
                    errCode: 0,
                    data: packagePost
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getPaymentLink = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.amount)
            {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`

                })
            }
            else {
                let infoItem = await db.PackagePost.findOne({
                    where: { id: data.id}
                })
                let item = [{
                    "name": `${infoItem.name}`,
                    "sku": infoItem.id,
                    "price": infoItem.price,
                    "currency": "USD",
                    "quantity": data.amount
                }]
    
                let create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": `http://localhost:3000/admin/payment/success`,
                        "cancel_url": "http://localhost:3000/admin/payment/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": item
                        },
                        "amount": {
                            "currency": "USD",
                            "total": +data.amount * infoItem.price
                        },
                        "description": "This is the payment description."
                    }]
                };
    
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        resolve({
                            errCode: -1,
                            errMessage: error,
                        })
    
                    } else {
                        resolve({
                            errCode: 0,
                            link: payment.links[1].href
                        })
    
                    }
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

let paymentOrderSuccess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.PayerID || !data.paymentId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let infoItem = await db.PackagePost.findOne({
                    where: { id: data.packageId}
                })
                let execute_payment_json = {
                    "payer_id": data.PayerID,
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": +data.amount * infoItem.price
                        }
                    }]
                };
                
                let paymentId = data.paymentId;
                
                paypal.payment.execute(paymentId, execute_payment_json,async function  (error, payment) {
                    if (error) {
                        resolve({
                            errCode: 0,
                            errMessage: error
                        })
                    } else {
                        let orderPackage = await db.OrderPackage.create({
                            packagePostId: data.packageId,
                            userId: data.userId,
                            currentPrice: infoItem.price,
                            amount: +data.amount
                        })
                        if (orderPackage) {
                            let user = await db.User.findOne({
                                where: {id : data.userId},
                                attributes: {
                                    exclude: ['userId']
                                }
                            })
                            let company = await db.Company.findOne({
                                where: { id: user.companyId},
                                raw: false
                            })
                            if (company)
                            {
                                if (infoItem.isHot == 0) {
                                    company.allowPost += +infoItem.value
                                }
                                else {
                                    company.allowHotPost += +infoItem.value
                                }
                                await company.save()

                            }
                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'Hệ thống đã ghi nhận lịch sử mua của bạn'
                        })
                    }
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getPackageByType, getPaymentLink , paymentOrderSuccess
}