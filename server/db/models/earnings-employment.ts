

module.exports = (sequelize:any, DataTypes:any) => {
    const EarningsEmployment = sequelize.define('EarningsEmployment', {
      currentEmployer:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      previousEmployer:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      businessSector: {
        type: DataTypes.STRING,
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
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status:{
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      }
    });
    EarningsEmployment.associate = (models:any) => {
     
      EarningsEmployment.belongsTo(models.Customer, {
        foreignKey: 'customerID',
      });
    };
    return EarningsEmployment;
  };
  