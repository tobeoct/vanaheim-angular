

module.exports = (sequelize:any, DataTypes:any) => {
    const EarningLiquidation = sequelize.define('EarningLiquidation', {
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      datePaused: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status:{
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      },
      liquidationStatus:{
        type: DataTypes.ENUM('Pending','EarningPaused','Processed','Declined'),
        allowNull: false,
        defaultValue: 'Pending'
      },
    
    });
    EarningLiquidation.associate = (models:any) => {
        
      EarningLiquidation.belongsTo(models.ApprovedEarning, {
        foreignKey: 'approvedEarningID'
      });
    };
    return EarningLiquidation;
  };
  
  
  