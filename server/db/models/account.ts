

module.exports = (sequelize:any, DataTypes:any) => {
  const Account = sequelize.define('Account', {
    bank:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
     code:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  });
  Account.associate = (models:any) => {
   
    Account.belongsTo(models.Customer, {
      foreignKey: 'customerID',
    });
  };
  return Account;
};
