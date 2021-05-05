

module.exports = (sequelize, DataTypes) => {
  const PushNotification = sequelize.define('PushNotification', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      allowNull:false
    },
  
  });
  PushNotification.associate = (models) => {
    
    PushNotification.belongsTo(models.Subscription, {
      foreignKey: 'subscriptionID'
    });
  };
  return PushNotification;
};


