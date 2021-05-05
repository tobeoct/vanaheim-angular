

module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    browserID: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  
  });
  Device.associate = (models) => {
    
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


