module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('LoanRequestLogs', 'monthlyPayment', {
        type: Sequelize.DECIMAL,
        allowNull: false
      }),
      queryInterface.changeColumn('LoanRequestLogs', 'totalRepayment', {
        type: Sequelize.DECIMAL,
        allowNull: false
      }),
      queryInterface.changeColumn('LoanRequestLogs', 'rate', {
        type: Sequelize.DECIMAL,
        allowNull: false
      }),
      queryInterface.changeColumn('LoanRequestLogs', 'accountNumber', {
        type: Sequelize.STRING,
        allowNull: false
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.changeColumn('LoanRequestLogs', 'monthlyPayment'),queryInterface.changeColumn('LoanRequestLogs', 'totalRepayment'),queryInterface.changeColumn('LoanRequestLogs', 'rate'),queryInterface.changeColumn('LoanRequestLogs', 'accountNumber')]);
  },
};