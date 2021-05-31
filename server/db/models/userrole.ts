

module.exports = (sequelize:any, DataTypes:any) => {
    const UserRole = sequelize.define('UserRole', {
      name:{
        type: DataTypes.STRING,
        allowNull: false,
      },
       code:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      description:{
        type: DataTypes.STRING,
        allowNull: false,
      },
     scope: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status:{
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      }
    
    });
    UserRole.associate = (models:any) => {
     
      models.UserRole.belongsToMany(models.Staff, {
          through:"staffrole",
          targetKey:"id",
        foreignKey: 'staffID'
      });
    };
    return UserRole;
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