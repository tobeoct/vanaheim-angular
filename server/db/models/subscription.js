

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isExpired:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  
  });
  Subscription.associate = (models) => {
    
    Subscription.hasMany(models.PushNotification, {
      foreignKey: 'subscriptionID',
      as:"pushNotifications"
    });
    Subscription.belongsTo(models.Device, {
      foreignKey: 'deviceID'
    });
  };
  return Subscription;
};


