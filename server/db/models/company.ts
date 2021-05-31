module.exports = (sequelize:any, DataTypes:any) => {
  const Company = sequelize.define('Company', {
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    rcNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    natureOfBusiness:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfIncorporation:{
      type: DataTypes.DATE,
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
    timeInBusiness: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
   
  });
  Company.associate = (models:any) => {
    
    Company.belongsTo(models.Customer, {
      foreignKey: 'customerID'
    });
    Company.hasMany(models.Shareholder, {
      foreignKey: 'companyID'
    });
  };
  return Company;
};