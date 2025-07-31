const fs = require('fs');
const csv = require('csv-parser');
const { Product, Department, testConnection, syncDatabase } = require('./database');

const loadProductsFromCSV = async (csvFilePath) => {
  const products = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const product = {
          name: row.name,
          description: row.description || null,
          price: parseFloat(row.price),
          department_name: row.department 
        };
        
        if (!product.name || !product.department_name || isNaN(product.price)) {
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

const insertProducts = async (products) => {
  try {
    const departmentNames = [...new Set(products.map(p => p.department_name))];
    
    for (const deptName of departmentNames) {
      await Department.findOrCreate({
        where: { name: deptName },
        defaults: { name: deptName }
      });
    }
    
    const departments = await Department.findAll({
      where: { name: departmentNames }
    });
    
    const deptMap = departments.reduce((map, dept) => {
      map[dept.name] = dept.id;
      return map;
    }, {});
    
    const productsWithDeptId = products.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      department_id: deptMap[product.department_name],
      image_url: product.image_url
    }));
    
    const result = await Product.bulkCreate(productsWithDeptId, {
      ignoreDuplicates: true,
      returning: true
    });
    
    console.log( Successfully inserted ${result.length} products into database);
    return result;
  } catch (error) {
    console.error(' Error inserting products:', error);
    throw error;
  }
};

const main = async () => {
  const csvFilePath = 'products.csv';
  
  try {
    if (!fs.existsSync(csvFilePath)) {
      console.error( CSV file not found: ${csvFilePath});
      console.log('💡 Please create a products.csv file with the following headers:');
      console.log('   name,description,price,department');
      process.exit(1);
    }
    
    console.log(' Starting CSV data import...');
    
    await testConnection();
    
    await syncDatabase();
    
    console.log( Reading products from ${csvFilePath}...);
    const products = await loadProductsFromCSV(csvFilePath);
    
    if (products.length === 0) {
      console.log('  No valid products found in CSV file');
      return;
    }
    
    console.log(' Inserting products into database...');
    await insertProducts(products);
    
    const totalProducts = await Product.count();
    console.log(\n Database now contains ${totalProducts} total products);
    
    const sampleProducts = await Product.findAll({
      limit: 3,
      order: [['created_at', 'DESC']]
    });
    
    console.log('\n Sample of recently added products:');
    sampleProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price} (${product.department})`);
    });
    
    console.log('\n CSV import completed successfully!');
    
  } catch (error) {
    console.error(' Error during CSV import:', error);
    process.exit(1);
  } finally {
    const { sequelize } = require('./database');
    await sequelize.close();
  }
};

if (require.main === module) {
  main();
}

module.exports = { loadProductsFromCSV, insertProducts };