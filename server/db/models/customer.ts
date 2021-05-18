

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