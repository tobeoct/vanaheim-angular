module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('LoanRequests', 'monthlyPayment', {
        type: Sequelize.DECIMAL,
        allowNull: false
      }),
      queryInterface.changeColumn('LoanRequests', 'totalRepayment', {
        type: Sequelize.DECIMAL,
        allowNull: false
      }),
      queryInterface.changeColumn('LoanRequests', 'rate', {
        type: Sequelize.DECIMAL,
        allowNull: false
      }),
      queryInterface.changeColumn('LoanRequests', 'accountNumber', {
        type: Sequelize.STRING,
        allowNull: false
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.changeColumn('LoanRequests', 'monthlyPayment'),queryInterface.changeColumn('LoanRequests', 'totalRepayment'),queryInterface.changeColumn('LoanRequests', 'rate'),queryInterface.changeColumn('LoanRequests', 'accountNumber')]);
  },
};