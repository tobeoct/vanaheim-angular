

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    category: DataTypes.STRING
  
  });
  return User;
};

