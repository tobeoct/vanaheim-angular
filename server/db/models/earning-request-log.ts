

module.exports = (sequelize:any, DataTypes:any) => {
  const EarningRequestLog = sequelize.define('EarningRequestLog', {
    type:{
      type: DataTypes.ENUM('Monthly ROI','End Of Tenor'),
      allowNull: false,
    }, 
    amount:{
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    monthlyPayment: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    payout: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    topUp: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    topUpPayout: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    maturityDate: {
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
    dateFunded:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestStatus:{
      type: DataTypes.ENUM('Pending','Processing','UpdateRequired','Declined','Error','Active','FundsReceived','Matured','TopUpRequest'),
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
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  });
  EarningRequestLog.associate = (models:any) => {
   
    EarningRequestLog.belongsTo(models.Customer, {
      foreignKey: 'customerID',
    });
     EarningRequestLog.hasMany(models.ApprovedEarning, {
      foreignKey: 'earningRequestLogID',
    });
    EarningRequestLog.belongsTo(models.EarningsEmployment, {
      foreignKey: 'employmentID',
    });
    EarningRequestLog.belongsTo(models.MeansOfIdentification, {
      foreignKey: 'meansOfIdentificationID',
    });
    EarningRequestLog.belongsTo(models.Account, {
      foreignKey: 'accountID',
    });
    EarningRequestLog.belongsTo(models.EarningRequest, {
      foreignKey: 'earningRequestID',
    });
  };
  return EarningRequestLog;
};

