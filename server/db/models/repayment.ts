

module.exports = (sequelize:any, DataTypes:any) => {
    const Repayment = sequelize.define('Repayment', {
      loanRequestID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateRepaid: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
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
      repaymentType:{
        type: DataTypes.ENUM('Partial','FullPayment'),
        allowNull: false,
        defaultValue: 'Partial'
      }
    
    });
    Repayment.associate = (models:any) => {
        
      Repayment.belongsTo(models.DisbursedLoan, {
        foreignKey: 'disbursedLoanID'
      });
    };
    return Repayment;
  };
  
  
  