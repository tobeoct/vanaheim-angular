module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Documents', 'path', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('Documents', 'path')]);
  },
};

