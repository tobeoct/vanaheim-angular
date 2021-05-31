module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Customers', 'title', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Customers', 'gender', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('Customers', 'title'),queryInterface.removeColumn('Customers', 'gender')]);
  },
};

