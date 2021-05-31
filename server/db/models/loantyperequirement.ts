module.exports = (sequelize:any, DataTypes:any) => {
  const LoanTypeRequirement = sequelize.define('LoanTypeRequirement', {
    employmentID:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    loanType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyID:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shareholderIDs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    collateralID:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  });
  LoanTypeRequirement.associate = (models:any) => {
   
    LoanTypeRequirement.belongsTo(models.LoanRequestLog, {
      foreignKey: 'loanRequestLogID',
    });
  };
  return LoanTypeRequirement;
};
