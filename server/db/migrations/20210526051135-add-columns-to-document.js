module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Documents', 'fileName', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('Documents', 'fileName')]);
  },
};

