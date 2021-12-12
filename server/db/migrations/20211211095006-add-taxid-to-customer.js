module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Customers', 'taxId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('Customers', 'taxId')]);
  },
};

