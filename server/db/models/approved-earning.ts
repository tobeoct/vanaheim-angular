

module.exports = (sequelize:any, DataTypes:any) => {
    const ApprovedEarning = sequelize.define('ApprovedEarning', {
      requestId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isClosed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      maturityDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nextPayment: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      nextPaymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lastPayment: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      lastPaymentDate: {
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
      earningStatus:{
        type: DataTypes.ENUM('PaidInFull','Defaulting','OnTrack','AwaitingFirstPayment','Liquidated','Pause'),
        allowNull: false,
        defaultValue: 'AwaitingFirstPayment'
      }
    
    });
    ApprovedEarning.associate = (models:any) => {
        
      ApprovedEarning.belongsTo(models.EarningRequest, {
        foreignKey: 'earningRequestID'
      });
      ApprovedEarning.belongsTo(models.EarningRequestLog, {
        foreignKey: 'earningRequestLogID'
      });
      ApprovedEarning.hasMany(models.EarningPayout, {
        foreignKey: 'approvedEarningID',
        as:"earningPayments"
      });
    };
    return ApprovedEarning;
  };
  
  
  