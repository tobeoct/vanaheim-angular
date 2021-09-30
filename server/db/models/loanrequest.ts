

module.exports = (sequelize:any, DataTypes:any) => {
  const LoanRequest = sequelize.define('LoanRequest', {
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
    amount: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.ENUM('Pending','Processing','UpdateRequired','NotQualified','Error','Approved','Completed','Defaulting'),
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
   loanTypeRequirementID:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  });
  LoanRequest.associate = (models:any) => {
   
    LoanRequest.belongsTo(models.Customer, {
      foreignKey: 'customerID',
    });
    // LoanRequest.belongsTo(models.LoanProduct, {
    //   foreignKey: 'loanProductID',
    // });
    // LoanRequest.belongsTo(models.LoanType, {
    //   foreignKey: 'loanTypeID',
    // });
    // LoanRequest.hasOne(models.LoanTypeRequirement, {
    //   foreignKey: 'loanTypeRequirementID',
    // });
     LoanRequest.hasMany(models.DisbursedLoan, {
      foreignKey: 'loanRequestID',
    });
    
  };
  return LoanRequest;
};

