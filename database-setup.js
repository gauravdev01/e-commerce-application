const { testConnection, syncDatabase } = require('./database');

const setupDatabase = async () => {
  console.log(' Setting up database...');
  
  try {

    console.log(' Testing database connection...');
    await testConnection();
    

    console.log('🗄  Creating database tables...');
    await syncDatabase();
    
    console.log(' Database setup completed successfully!');
    console.log('\n Next steps:');
    console.log('   1. Run "npm run load-csv" to import sample data');
    console.log('   2. Run "npm start" to start the API server');
    
  } catch (error) {
    console.error(' Database setup failed:', error);
    console.log('\n Troubleshooting tips:');
    console.log('   - Ensure PostgreSQL is running');
    console.log('   - Check database credentials in config.js');
    console.log('   - Verify database "ecommerce_db" exists');
    process.exit(1);
  } finally {
    const { sequelize } = require('./database');
    await sequelize.close();
  }
};

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 
