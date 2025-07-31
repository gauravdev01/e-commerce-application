const { Sequelize } = require('sequelize');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const Product = require('./models/Product')(sequelize);
const Department = require('./models/Department')(sequelize);

Product.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Product, { foreignKey: 'department_id', as: 'products' });

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connection has been established successfully.');
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
  }
};

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(' Database synchronized successfully.');
  } catch (error) {
    console.error(' Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  Product,
  Department,
  testConnection,
  syncDatabase
};