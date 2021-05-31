'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Documents', {
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
      extension: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      requirement:{
        type: Sequelize.STRING,
        allowNull: true,
      },
       code:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      status:{
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Inactive'
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
    await queryInterface.dropTable('Documents');
  }
};