

module.exports = (sequelize:any, DataTypes:any) => {
    const DisbursedLoan = sequelize.define('DisbursedLoan', {
      requestID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateDisbursed: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isClosed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      maturityDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nextPayment: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nextRepaymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status:{
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      },
      loanStatus:{
        type: DataTypes.ENUM('PaidInFull','Defaulting','OnTrack','AwaitingFirstPayment'),
        allowNull: false,
        defaultValue: 'AwaitingFirstPayment'
      }
    
    });
    DisbursedLoan.associate = (models:any) => {
        
      DisbursedLoan.belongsTo(models.LoanRequest, {
        foreignKey: 'loanRequestID'
      });
      DisbursedLoan.belongsTo(models.LoanRequestLog, {
        foreignKey: 'loanRequestLogID'
      });
      DisbursedLoan.hasMany(models.Repayment, {
        foreignKey: 'disbursedLoanID',
        as:"repayments"
      });
    };
    return DisbursedLoan;
  };
  
  
  