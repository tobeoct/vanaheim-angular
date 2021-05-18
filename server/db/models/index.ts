const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const configuration:any = {
  "development": {
    "username": "postgres",
    "password": null,
    "database": "vanaheim-dev",
    "host": "127.0.0.1",
    "port":5432,
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": null,
    "database": "vanaheim-dev",
    "host": "127.0.0.1",
    "port":5432,
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "vanaheim",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "use_env_variable": "DATABASE_URL",
    "ssl":true,
    "dialectOptions": {
      "ssl": {
        "require": true, // This will help you. But you will see nwe error
        "rejectUnauthorized": false // This line will fix new error
      }
    },
  }
};
//require(`${__dirname}/../config/config.json`)[env];

const config = configuration[env];
const db:any = {};

let sequelize:any;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
  );
}

fs
  .readdirSync(__dirname)
  .filter((file:any) =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach((file:any) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);//sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;