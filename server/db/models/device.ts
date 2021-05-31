

module.exports = (sequelize:any, DataTypes:any) => {
  const Device = sequelize.define('Device', {
    browserID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  
  });
  Device.associate = (models:any) => {
    
    Device.hasOne(models.Subscription, {
      foreignKey: 'deviceID',
      as:"subscription"
    });
    Device.belongsToMany(models.Customer, {
      foreignKey: 'customerID',
      through:"customerdevice"
    });
  };
  return Device;
};


