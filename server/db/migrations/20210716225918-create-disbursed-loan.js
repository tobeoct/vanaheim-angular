'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DisbursedLoans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      requestID: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateDisbursed: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isClosed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      maturityDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      nextPayment: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nextRepaymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      loanStatus:{
        type: Sequelize.ENUM('PaidInFull','Defaulting','OnTrack','AwaitingFirstPayment'),
        allowNull: false,
        defaultValue: 'AwaitingFirstPayment'
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
      loanRequestID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'LoanRequests',
          key: 'id',
          as: 'loanRequestID',
        }
      },
      loanRequestLogID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'LoanRequestLogs',
          key: 'id',
          as: 'loanRequestLogID',
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
    await queryInterface.dropTable('DisbursedLoans');
  }
};