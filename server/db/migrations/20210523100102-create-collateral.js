'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Collaterals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      owner:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      valuation: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      code:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      status:{
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      },
      documentID:{
       type: Sequelize.INTEGER,
       allowNull: true,
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
    await queryInterface.dropTable('Collaterals');
  }
};