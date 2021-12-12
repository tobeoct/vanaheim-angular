'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MeansOfIdentifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('Active','Inactive'),
        allowNull:false
      },
      documentID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Documents',
          key: 'id',
          as: 'documentID',
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull:false
      },
      idNumber: {
        type: Sequelize.STRING,
        allowNull:false
      },
      issueDate: {
        type: Sequelize.DATE,
        allowNull:true
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull:true
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
    await queryInterface.dropTable('MeansOfIdentifications');
  }
};