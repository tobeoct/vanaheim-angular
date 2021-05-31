module.exports = (sequelize:any, DataTypes:any) => {
  const Shareholder = sequelize.define('Shareholder', {
   
    title:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherNames: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    surname:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     dateOfBirth:{
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
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    educationalQualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
   
  });
  Shareholder.associate = (models:any) => {
    
    Shareholder.belongsTo(models.Customer, {
      foreignKey: 'customerID'
    });
    Shareholder.belongsTo(models.Company, {
      foreignKey: 'companyID'
    });
  };
  return Shareholder;
};
