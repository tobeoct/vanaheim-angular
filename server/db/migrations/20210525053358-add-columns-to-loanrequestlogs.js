module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('LoanRequestLogs', 'monthlyPayment', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('LoanRequestLogs', 'totalRepayment', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('LoanRequestLogs', 'rate', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('LoanRequestLogs', 'maturityDate', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('LoanRequestLogs', 'monthlyPayment'),queryInterface.removeColumn('LoanRequestLogs', 'totalRepayment'),queryInterface.removeColumn('LoanRequestLogs', 'rate'),queryInterface.removeColumn('LoanRequestLogs', 'maturityDate')]);
  },
};

