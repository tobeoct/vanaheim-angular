'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EarningLiquidations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      datePaused: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status:{
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      },
      liquidationStatus:{
        type: Sequelize.ENUM('Pending','EarningPaused','Processed','Declined'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      approvedEarningID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'ApprovedEarnings',
          key: 'id',
          as: 'approvedEarningID',
        }
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
    await queryInterface.dropTable('EarningLiquidations');
  }
};