module.exports = (sequelize:any, DataTypes:any) => {
  const Collateral = sequelize.define('Collateral', {
    owner:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    valuation: {
      type: DataTypes.DECIMAL,
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
    },
    documentID:{
     type: DataTypes.INTEGER,
     allowNull: true,
   }
   
  });
  Collateral.associate = (models:any) => {
    
    Collateral.belongsTo(models.Customer, {
      foreignKey: 'customerID'
    });
  };
  return Collateral;
};
