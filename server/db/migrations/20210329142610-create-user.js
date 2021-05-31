'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('Active','Inactive'),
        allowNull:false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      passwordHash:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      passwordRetries:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
       token:{
        type: Sequelize.STRING,
        allowNull: true,
      },
       tokenExpirationDate:{
        type: Sequelize.DATE,
        allowNull: true,
      },
       phoneNumber:{
        type: Sequelize.STRING,
        allowNull: false,
      },
       email:{
        type: Sequelize.STRING,
        allowNull: false,
      },
       code:{
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Users');
  }
};