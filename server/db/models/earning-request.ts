

module.exports = (sequelize:any, DataTypes:any) => {
  const EarningRequest = sequelize.define('EarningRequest', {
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
    topUp: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    topUpPayout: {
      type: DataTypes.DECIMAL,
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
  EarningRequest.associate = (models:any) => {
   
    EarningRequest.belongsTo(models.Customer, {
      foreignKey: 'customerID',
    });
    EarningRequest.belongsTo(models.EarningsEmployment, {
      foreignKey: 'employmentID',
    });
    EarningRequest.belongsTo(models.MeansOfIdentification, {
      foreignKey: 'meansOfIdentificationID',
    });
     EarningRequest.hasMany(models.ApprovedEarning, {
      foreignKey: 'earningRequestID',
    });
    EarningRequest.belongsTo(models.Account, {
      foreignKey: 'accountID',
    });
    
  };
  return EarningRequest;
};

