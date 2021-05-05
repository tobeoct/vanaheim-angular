

module.exports = (sequelize, DataTypes) => {
    const NOK = sequelize.define('NOK', {
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
     
    });
    NOK.associate = (models) => {
      
      NOK.belongsTo(models.Customer, {
        foreignKey: 'customerID'
      });
    };
    return NOK;
  };
  
//   firstname:string;
//   othernames:string;
//   address:string;
//   email:string;
//   phonenumber:string;
//   dateOfBirth:string;
//    gender:Gender;
//    relationship:Relationship;