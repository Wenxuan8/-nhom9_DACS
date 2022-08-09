'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Note extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //Post
            Note.belongsTo(models.Post,{foreignKey:'postId',targetKey:'id',as:'postNoteData'})

        }
    };
    Note.init({
        postId: DataTypes.INTEGER,
        note: DataTypes.STRING
    }, 
    {
        sequelize,
        modelName: 'Note',
    });
    return Note;
};