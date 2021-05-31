

module.exports = (sequelize:any, DataTypes:any) => {
    const Customer = sequelize.define('Customer', {
      firstName:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      otherNames: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      BVN:{
        type: DataTypes.STRING,
        allowNull: true,
      },
       dateOfBirth:{
        type: DataTypes.DATE,
        allowNull: true,
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
      maritalStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status:{
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      }
    });
    Customer.associate = (models:any) => {
      Customer.hasOne(models.NOK, {
        foreignKey: 'customerID',
        as: 'NOK',
      });
      Customer.hasMany(models.Device, {
        foreignKey: 'customerID',
        as: 'devices',
      });
      Customer.hasMany(models.Employment, {
        foreignKey: 'customerID',
        as: 'employments',
      });
      Customer.hasMany(models.Account, {
        foreignKey: 'customerID',
        as: 'accounts',
      });
      Customer.hasMany(models.Collateral, {
        foreignKey: 'customerID',
        as: 'collaterals',
      });
      Customer.hasMany(models.Company, {
        foreignKey: 'customerID',
        as: 'companies',
      });
      Customer.hasMany(models.Document, {
        foreignKey: 'customerID',
        as: 'documents',
      });
      Customer.belongsTo(models.User, {
        foreignKey: 'userID',
        onDelete: 'CASCADE',
      });
    };
    return Customer;
  };
  
//   firstname:string;
//   othernames:string;
//   surname:string;
//   address:string;
//   email:string;
//   phonenumber:string;
//   dateOfBirth:string;
//    gender:Gender;
//    maritalStatus:MaritalStatus;
//    BVN:string;
//    NOK:NOK;
//   customerid:string;