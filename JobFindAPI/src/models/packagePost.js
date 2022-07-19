'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PackagePost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //user
            PackagePost.belongsToMany(models.User,{through: 'OrderPackage'})
        }
    };
    PackagePost.init({
        name: DataTypes.STRING,
        value: DataTypes.INTEGER,
        price: DataTypes.DOUBLE,
        isHot: DataTypes.TINYINT
    }, 
    {
        sequelize,
        modelName: 'PackagePost',
    });
    return PackagePost;
};