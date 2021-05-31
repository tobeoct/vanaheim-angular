'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LoanTypeRequirements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employmentID:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      loanType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyID:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      shareholderIDs: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      collateralID:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Active','Inactive'),
        allowNull:false
      },
      loanRequestLogID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'LoanRequestLogs',
          key: 'id',
          as: 'loanRequestLogID',
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
    await queryInterface.dropTable('LoanTypeRequirements');
  }
};