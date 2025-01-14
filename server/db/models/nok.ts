

module.exports = (sequelize:any, DataTypes:any) => {
    const NOK = sequelize.define('NOK', {
      title:{
        type: DataTypes.STRING,
        allowNull: false,
      },
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
      status:{
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      }
     
    });
    NOK.associate = (models:any) => {
      
      NOK.belongsTo(models.Customer, {
        foreignKey: 'customerID'
      });
    };
    return NOK;
  };
  