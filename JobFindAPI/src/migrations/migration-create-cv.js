'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Cvs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            file: {
                type: Sequelize.BLOB('long')
            },
            post_id: {
                type: Sequelize.INTEGER
            },
            isChecked: {
                type: Sequelize.BOOLEAN
            },
            description: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Cvs');
    }
};