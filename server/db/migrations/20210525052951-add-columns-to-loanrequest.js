module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('LoanRequests', 'monthlyPayment', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('LoanRequests', 'totalRepayment', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('LoanRequests', 'rate', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('LoanRequests', 'maturityDate', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('LoanRequests', 'monthlyPayment'),queryInterface.removeColumn('LoanRequests', 'totalRepayment'),queryInterface.removeColumn('LoanRequests', 'rate'),queryInterface.removeColumn('LoanRequests', 'maturityDate')]);
  },
};

