

module.exports = (sequelize:any, DataTypes:any) => {
  const LoanRequestLog = sequelize.define('LoanRequestLog', {
    loanType:{
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    loanProduct:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenure: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    denominator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    monthlyPayment: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalRepayment: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maturityDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestDate:{
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateApproved:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateProcessed:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateDeclined:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateDueForDisbursement:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestStatus:{
      type: DataTypes.ENUM('Pending','Processing','UpdateRequired','NotQualified','Error','Approved'),
      allowNull: false,
      defaultValue: 'Pending'
    },
     code:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestId:{
     type: DataTypes.STRING,
     allowNull: false,
   },
   applyingAs:{
    type: DataTypes.STRING,
    allowNull: false,
  },
    loanPurpose:{
     type: DataTypes.STRING,
     allowNull: false,
   },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  });
  LoanRequestLog.associate = (models:any) => {
   
    LoanRequestLog.belongsTo(models.Customer, {
      foreignKey: 'customerID',
    });
    LoanRequestLog.belongsTo(models.LoanRequest, {
      foreignKey: 'loanRequestID',
    });
    LoanRequestLog.hasOne(models.DisbursedLoan, {
     foreignKey: 'loanRequestLogID',
   });
    // LoanRequestLog.belongsTo(models.LoanProduct, {
    //   foreignKey: 'loanProductID',
    // });
    // LoanRequestLog.belongsTo(models.LoanType, {
    //   foreignKey: 'loanTypeID',
    // });
    LoanRequestLog.hasOne(models.LoanTypeRequirement, {
      foreignKey: 'loanRequestLogID',
      as:"loanTypeRequirement"
    });
  };
  return LoanRequestLog;
};
