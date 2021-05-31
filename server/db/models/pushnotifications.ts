

module.exports = (sequelize:any, DataTypes:any) => {
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
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  
  });
  PushNotification.associate = (models:any) => {
    
    PushNotification.belongsTo(models.Subscription, {
      foreignKey: 'subscriptionID'
    });
  };
  return PushNotification;
};


