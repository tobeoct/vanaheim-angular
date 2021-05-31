'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      } ,
      status: {
        type: Sequelize.ENUM('Active','Inactive'),
        allowNull:false
      },
      firstName:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      otherNames: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      BVN:{
        type: Sequelize.STRING,
        allowNull: true,
      },
       dateOfBirth:{
        type: Sequelize.DATE,
        allowNull: true,
      },
       code:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber:{
        type: Sequelize.STRING,
        allowNull: false,
      },
     email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      maritalStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userID',
        },
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
    await queryInterface.dropTable('Customers');
  }
};