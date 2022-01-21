module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Documents', 'loanRequestLogID'),
      queryInterface.removeColumn('Documents', 'loanRequestID'),
      queryInterface.addColumn('Documents', 'requestId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),

    ]);
  },

  down: (queryInterface,Sequelize) => {
    return Promise.all([queryInterface.removeColumn('Documents', 'requestId'), 
    queryInterface.addColumn('Documents', 'loanRequestID', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }), 
    queryInterface.addColumn('Documents', 'loanRequestLogID', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
  ]);
  },
};

