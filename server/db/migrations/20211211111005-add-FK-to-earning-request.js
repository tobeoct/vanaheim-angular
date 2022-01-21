module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('EarningRequests', 'employmentID', {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'EarningsEmployments',
          key: 'id',
          as: 'employmentID',
        },
        allowNull:true
      }),
      queryInterface.addColumn('EarningRequests', 'meansOfIdentificationID', {
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
    return Promise.all([queryInterface.removeColumn('EarningRequests', 'employmentID'),queryInterface.removeColumn('EarningRequests', 'meansOfIdentificationID')]);
  },
};

