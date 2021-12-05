module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ApprovedEarnings', 'lastPayment', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
      queryInterface.addColumn('ApprovedEarnings', 'lastPaymentDate', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('ApprovedEarnings', 'lastPayment'),queryInterface.removeColumn('ApprovedEarnings', 'lastPaymentDate')]);
  },
};

