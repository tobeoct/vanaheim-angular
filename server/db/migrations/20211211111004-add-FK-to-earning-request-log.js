module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('EarningRequestLogs', 'employmentID', {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'EarningsEmployments',
          key: 'id',
          as: 'employmentID',
        },
        allowNull:true
      }),
      queryInterface.addColumn('EarningRequestLogs', 'meansOfIdentificationID', {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'MeansOfIdentifications',
          key: 'id',
          as: 'meansOfIdentificationID',
        },
        allowNull:true
      })
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('EarningRequestLogs', 'employmentID'),queryInterface.removeColumn('EarningRequestLogs', 'meansOfIdentificationID')]);
  },
};

