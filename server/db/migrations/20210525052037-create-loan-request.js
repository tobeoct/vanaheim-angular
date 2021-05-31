'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LoanRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loanType:{
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      loanProduct:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      tenure: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      denominator: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      accountNumber:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      requestDate:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateApproved:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateProcessed:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateDeclined:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateDueForDisbursement:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      failureReason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requestStatus:{
        type: Sequelize.ENUM('Pending','Processing','UpdateRequired','NotQualified','Error','Approved'),
        allowNull: false,
        defaultValue: 'Pending'
      },
       code:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      requestId:{
       type: Sequelize.STRING,
       allowNull: false,
     },
     applyingAs:{
      type: Sequelize.STRING,
      allowNull: false,
    },
      loanPurpose:{
       type: Sequelize.STRING,
       allowNull: false,
     },
     loanTypeRequirementID:{
      type: Sequelize.INTEGER,
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
        }
      },
      monthlyPayment: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalRepayment: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('LoanRequests');
  }
};