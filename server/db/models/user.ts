

module.exports = (sequelize:any, DataTypes:any) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordRetries:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
     token:{
      type: DataTypes.STRING,
      allowNull: true,
    },
     tokenExpirationDate:{
      type: DataTypes.DATE,
      allowNull: true,
    },
     phoneNumber:{
      type: DataTypes.STRING,
      allowNull: false,
    },
     email:{
      type: DataTypes.STRING,
      allowNull: false,
    },
     code:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  
  });
  User.associate = (models:any) => {
    User.hasOne(models.Customer, {
      foreignKey: 'userID',
      as: 'customer',
    });
    User.hasOne(models.Staff, {
      foreignKey: 'userID',
      as: 'staff',
    });
  };
  return User;
};



// username:string;
//     passwordSalt:string;
//      passwordHash:string;
//      passwordRetries:string;
//      category:UserCategory;
//      customer!:Customer;
//      staff!:Staff;
//      name:string;
//      email:string;
//      token:string;
//      tokenExpirationDate:Date;
//      phoneNumber:string;