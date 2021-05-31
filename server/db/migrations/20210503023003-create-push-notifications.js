'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PushNotifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      body: {
        type: Sequelize.STRING(40000),
        allowNull:false
      },
      photo: {
        type: Sequelize.STRING,
        allowNull:true
      },
      url: {
        type: Sequelize.STRING,
        allowNull:true
      },
      status: {
        type: Sequelize.ENUM('Active','Inactive'),
        allowNull:false
      }, 
      isSent: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      subscriptionID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Subscriptions',
          key: 'id',
          as: 'subscriptionID',
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
    await queryInterface.dropTable('PushNotifications');
  }
};