

module.exports = (sequelize:any, DataTypes:any) => {
  const Document = sequelize.define('Document', {
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    requirement:{
      type: DataTypes.STRING,
      allowNull: true,
    },
     code:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName:{
     type: DataTypes.STRING,
     allowNull: false,
   },
   loanRequestID:{
    type: DataTypes.INTEGER,
    allowNull: true,
   },
    status:{
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Inactive'
    }
  });
  Document.associate = (models:any) => {
   
    Document.belongsTo(models.Customer, {
      foreignKey: 'customerID',
    });
  };
  return Document;
};
