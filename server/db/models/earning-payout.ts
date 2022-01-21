

module.exports = (sequelize:any, DataTypes:any) => {
    const EarningPayout = sequelize.define('EarningPayout', {
      earningRequestId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      datePaid: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      startingPrincipal: {
        type: DataTypes.DECIMAL,
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
      paymentType:{
        type: DataTypes.ENUM('Partial','FullPayment'),
        allowNull: false,
        defaultValue: 'Partial'
      },
      type:{
        type: DataTypes.ENUM('Monthly ROI','End Of Tenor'),
        allowNull: false,
      }, 
    
    });
    EarningPayout.associate = (models:any) => {
        
      EarningPayout.belongsTo(models.ApprovedEarning, {
        foreignKey: 'approvedEarningID'
      });
    };
    return EarningPayout;
  };
  
  
  