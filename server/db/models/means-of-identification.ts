

module.exports = (sequelize:any, DataTypes:any) => {
    const MeansOfIdentification = sequelize.define('MeansOfIdentification', {
      type:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      idNumber:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      issueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiryDate:{
        type: DataTypes.DATE,
        allowNull: true,
      },
      status:{
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active'
      }
     
    });
    MeansOfIdentification.associate = (models:any) => {
      
      MeansOfIdentification.belongsTo(models.Document, {
        foreignKey: 'documentID'
      });
    };
    return MeansOfIdentification;
  };
  