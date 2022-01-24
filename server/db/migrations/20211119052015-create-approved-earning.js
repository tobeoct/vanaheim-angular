'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ApprovedEarnings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      requestId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isClosed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      maturityDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nextPayment: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      nextPaymentDate: {
        type: Sequelize.DATE,
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
      earningStatus:{
        type: Sequelize.ENUM('PaidInFull','Defaulting','OnTrack','AwaitingFirstPayment','Liquidated','Pause'),
        allowNull: false,
        defaultValue: 'AwaitingFirstPayment'
      },
      earningRequestID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'EarningRequests',
          key: 'id',
          as: 'earningRequestID',
        }
      },
      earningRequestLogID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'EarningRequestLogs',
          key: 'id',
          as: 'earningRequestLogID',
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
    await queryInterface.dropTable('ApprovedEarnings');
  }
};