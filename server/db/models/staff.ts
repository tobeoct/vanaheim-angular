

module.exports = (sequelize:any, DataTypes:any) => {
  const Staff = sequelize.define('Staff', {
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
    position:{
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
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }
  
  });
  Staff.associate = (models:any) => {
    Staff.hasOne(models.UserRole, {
      foreignKey: 'staffID',
      as: 'userRole',
    });
    Staff.belongsTo(models.User, {
      foreignKey: 'userID',
      onDelete: 'CASCADE',
    });
  };
  return Staff;
};

//   firstname:string;
//     othernames:string;
//     surname:string;
//     role:UserRole;
//     address:string;
//     phoneNumber:string;
//     position:string;
//     email:string;
//     gender:Gender;
//     dateOfBirth:string;
//     staffId:string