module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('LoanRequestLogs','loanTypeRequirementID',{
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('LoanRequestLogs', 'loanTypeRequirementID')]);
  },
};
