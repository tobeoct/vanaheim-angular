module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('EarningLiquidations', 'customerID', {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Customers',
          key: 'id',
          as: 'customerID',
        },
        allowNull:true
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('EarningLiquidations', 'customerID')]);
  },
};

