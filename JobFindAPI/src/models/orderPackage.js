'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderPackage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
           //User
           OrderPackage.belongsTo(models.User,{foreignKey:'userId',targetKey:'id',as: 'userOrderData'})

           //Package
            OrderPackage.belongsTo(models.PackagePost,{foreignKey: 'packagePostId',targetKey:'id',as:'packageOrderData'})
        }
    };
    OrderPackage.init({
        packetPostId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        currentPrice: DataTypes.DOUBLE
    }, 
    {
        sequelize,
        modelName: 'OrderPost',
    });
    return OrderPackage;
};