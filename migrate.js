const { sequelize, Product, Department } = require('./database');

const migrateDepartments = async () => {
  console.log(' Starting department migration...');
  
  try {
    console.log('📋 Step 1: Creating new schema...');
    await sequelize.sync({ force: true });
    
    console.log(' Step 2: Creating departments...');
    
    const departmentNames = [
      'Electronics',
      'Clothing', 
      'Home & Garden',
      'Kitchen & Dining'
    ];
    
    const departments = await Department.bulkCreate(
      departmentNames.map(name => ({ name })),
      { returning: true }
    );
    
    console.log( Created ${departments.length} departments);
    
    console.log('📋 Step 3: Loading products with department references...');
    
    const fs = require('fs');
    const csv = require('csv-parser');
    
    const loadProductsFromCSV = async () => {
      const products = [];
      
      return new Promise((resolve, reject) => {
        fs.createReadStream('products.csv')
          .pipe(csv())
          .on('data', (row) => {
            const department = departments.find(d => d.name === row.department);
            
            if (!department) {
              console.warn(  Unknown department: ${row.department}, skipping product: ${row.name});
              return;
            }
            
            const product = {
              name: row.name,
              description: row.description || null,
              price: parseFloat(row.price),
              department_id: department.id,
              image_url: null 
            };
            
            if (!product.name || !product.department_id || isNaN(product.price)) {
              console.warn(  Skipping invalid row: ${JSON.stringify(row)});
              return;
            }
            
            products.push(product);
          })
          .on('end', () => {
            console.log( Found ${products.length} valid products in CSV file);
            resolve(products);
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    };
    
    const products = await loadProductsFromCSV();
    
    if (products.length > 0) {
      const createdProducts = await Product.bulkCreate(products, {
        returning: true
      });
      
      console.log( Successfully inserted ${createdProducts.length} products with department references);
    }
    
    console.log(' Step 4: Verifying migration...');
    
    const allDepartments = await Department.findAll({
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name', 'price']
      }]
    });
    
    console.log('\n Migration Results:');
    console.log('=====================');
    
    allDepartments.forEach(dept => {
      console.log(\n ${dept.name} (ID: ${dept.id}));
      console.log(`   Products: ${dept.products.length}`);
      dept.products.forEach(product => {
        console.log(`   - ${product.name}: $${product.price}`);
      });
    });
    
    console.log('\n Department migration completed successfully!');
    
  } catch (error) {
    console.error( 'Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  migrateDepartments();
}

module.exports = { migrateDepartments };