module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('NOKs', 'title', {
        type: Sequelize.STRING
      }),
      
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('NOKs', 'title')]);
  },
};

