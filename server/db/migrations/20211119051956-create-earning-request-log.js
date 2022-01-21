'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EarningRequestLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Inactive'
      },
      type: {
        type: Sequelize.ENUM('Monthly ROI', 'End Of Tenor'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      monthlyPayment: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      payout: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },

      topUp: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      topUpPayout: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maturityDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requestDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateApproved: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateProcessed: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateDeclined: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateFunded: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      failureReason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requestStatus: {
        type: Sequelize.ENUM('Pending', 'Processing', 'UpdateRequired', 'Declined', 'Error', 'Active', 'FundsReceived', 'Matured','TopUpRequest','LiquidationRequest'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requestId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      taxId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customerID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Customers',
          key: 'id',
          as: 'customerID',
        }
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
      accountID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Accounts',
          key: 'id',
          as: 'accountID',
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
    await queryInterface.dropTable('EarningRequestLogs');
  }
};