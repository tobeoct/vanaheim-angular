

module.exports = (sequelize:any, DataTypes:any) => {
  const Employment = sequelize.define('Employment', {
    employer:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessSector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payDay:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    netMonthlySalary: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
     code:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber:{
      type: DataTypes.STRING,
      allowNull: false,
    },
   email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  });
  Employment.associate = (models:any) => {
   
    Employment.belongsTo(models.Customer, {
      foreignKey: 'customerID',
    });
  };
  return Employment;
};
