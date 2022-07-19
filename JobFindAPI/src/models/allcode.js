'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //detailpost
            Allcode.hasMany(models.DetailPost, { foreignKey: 'categoryJobCode', as: 'jobTypePostData' })
            Allcode.hasMany(models.DetailPost, { foreignKey: 'categoryWorktypeCode', as: 'workTypePostData' })
            Allcode.hasMany(models.DetailPost, { foreignKey: 'salaryJobCode', as: 'salaryTypePostData' })
            Allcode.hasMany(models.DetailPost, { foreignKey: 'categoryJoblevelCode', as: 'jobLevelPostData' })
            Allcode.hasMany(models.DetailPost, { foreignKey: 'experienceJobCode', as: 'expTypePostData' })
            Allcode.hasMany(models.DetailPost, { foreignKey: 'genderPostCode', as: 'genderPostData' })
            Allcode.hasMany(models.DetailPost, { foreignKey: 'addressCode', as: 'provincePostData' })
    
            //post
            Allcode.hasMany(models.DetailPost, { foreignKey: 'statusCode', as: 'statusPostData' })

            //account
            Allcode.hasMany(models.Account, { foreignKey: 'roleCode', as: 'roleData' })
            Allcode.hasMany(models.Account, { foreignKey: 'statusCode', as: 'statusAccountData' })

            // //user
            Allcode.hasMany(models.User, { foreignKey: 'genderCode', as: 'genderData' })

            // //notification
            // Allcode.hasMany(models.Notification, { foreignKey: 'typeCode', as: 'typeData' })

            // //company
            Allcode.hasMany(models.Company, { foreignKey: 'statusCode', as: 'statusCompanyData' })
            Allcode.hasMany(models.Company, { foreignKey: 'censorCode', as: 'censorData' })

        }
    };
    Allcode.init({
        type: DataTypes.STRING,
        value: DataTypes.STRING,
        code: DataTypes.STRING,
        image: DataTypes.STRING
    }, 
    {
        sequelize,
        modelName: 'Allcode',
    });
    return Allcode;
};