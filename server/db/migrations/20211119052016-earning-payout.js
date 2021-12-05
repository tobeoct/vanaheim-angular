'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EarningPayouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      earningRequestId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      datePaid: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      startingPrincipal: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
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
      paymentType:{
        type: Sequelize.ENUM('Partial','FullPayment'),
        allowNull: false,
        defaultValue: 'Partial'
      },
      type:{
        type: Sequelize.ENUM('Monthly ROI','End Of Tenor'),
        allowNull: false,
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
    await queryInterface.dropTable('EarningPayouts');
  }
};