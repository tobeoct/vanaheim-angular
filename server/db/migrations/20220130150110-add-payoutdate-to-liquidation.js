module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('EarningLiquidations', 'payoutDate', {
        type: Sequelize.DATE,
        allowNull:true
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('EarningLiquidations', 'payoutDate')]);
  },
};

