'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NOKs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        allowNull: false,
      },
       dateOfBirth:{
        type: Sequelize.DATE,
        allowNull: false,
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
      relationship: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Active','Inactive'),
        allowNull:false
      },
      customerID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Customers',
          key: 'id',
          as: 'customerID',
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
    await queryInterface.dropTable('NOKs');
  }
};