

module.exports = (sequelize:any, DataTypes:any) => {
    const EarningTopUp = sequelize.define('EarningTopUp', {
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
      status:{
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      },
      topUpStatus:{
        type: DataTypes.ENUM('Pending','Processed'),
        allowNull: false,
        defaultValue: 'Pending'
      },
    
    });
    EarningTopUp.associate = (models:any) => {
        
      EarningTopUp.belongsTo(models.ApprovedEarning, {
        foreignKey: 'approvedEarningID'
      });
      EarningTopUp.belongsTo(models.Customer, {
        foreignKey: 'customerID'
      });
    };
    return EarningTopUp;
  };
  
  
  