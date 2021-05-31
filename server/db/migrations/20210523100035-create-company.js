'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      rcNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      natureOfBusiness:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateOfIncorporation:{
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
      timeInBusiness: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status:{
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
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
    await queryInterface.dropTable('Companies');
  }
};