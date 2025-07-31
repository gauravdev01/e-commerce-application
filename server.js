const express = require('express');
const { Product, Department, testConnection, syncDatabase, sequelize } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce API',
    endpoints: {
      products: '/products',
      product: '/products/:id',
      departments: '/departments',
      department: '/departments/:id'
    }
  });
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, department, department_id } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    // Support both department name and department_id filtering
    if (department) {
      whereClause = { '$department.name$': department };
    } else if (department_id) {
      whereClause = { department_id: parseInt(department_id) };
    }
    
    const products = await Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: Department,
        as: 'department',
        attributes: ['id', 'name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      products: products.rows,
      total: products.count,
      page: parseInt(page),
      totalPages: Math.ceil(products.count / limit),
      filters: {
        department,
        department_id: department_id ? parseInt(department_id) : null
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Department,
        as: 'department',
        attributes: ['id', 'name']
      }]
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product
app.post('/products', async (req, res) => {
  try {
    const { name, description, price, department, image_url } = req.body;
    
    // Validate required fields
    if (!name || !price || !department) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'price', 'department'],
        received: { name, price, department }
      });
    }
    
    // Validate price is a positive number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ 
        error: 'Price must be a positive number',
        received: price 
      });
    }
    
    // Validate name and department are not empty strings
    if (name.trim() === '' || department.trim() === '') {
      return res.status(400).json({ 
        error: 'Name and department cannot be empty strings' 
      });
    }
    
    // Find or create department
    let departmentRecord = await Department.findOne({
      where: { name: department.trim() }
    });
    
    if (!departmentRecord) {
      departmentRecord = await Department.create({
        name: department.trim()
      });
    }
    
    // Create the product
    const product = await Product.create({
      name: name.trim(),
      description: description || null,
      price: priceNum,
      department_id: departmentRecord.id,
      image_url: image_url || null
    });
    
    // Fetch the product with department info
    const productWithDepartment = await Product.findByPk(product.id, {
      include: [{
        model: Department,
        as: 'department',
        attributes: ['id', 'name']
      }]
    });
    
    res.status(201).json({
      message: 'Product created successfully',
      product: productWithDepartment
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all departments
app.get('/departments', async (req, res) => {
  try {
    const { include_products = false } = req.query;
    
    const includeOptions = include_products === 'true' ? [{
      model: Product,
      as: 'products',
      attributes: ['id', 'name', 'price', 'image_url'],
      order: [['created_at', 'DESC']]
    }] : [];
    
    const departments = await Department.findAll({
      attributes: ['id', 'name', 'created_at', 'updated_at'],
      include: includeOptions,
      order: [['name', 'ASC']]
    });
    
    const formattedDepartments = departments.map(dept => {
      const departmentData = {
        id: dept.id,
        name: dept.name,
        created_at: dept.created_at,
        updated_at: dept.updated_at
      };
      
      if (include_products === 'true') {
        departmentData.products = dept.products || [];
        departmentData.product_count = dept.products ? dept.products.length : 0;
      } else {
        departmentData.product_count = dept.products ? dept.products.length : 0;
      }
      
      return departmentData;
    });
    
    res.status(200).json({
      departments: formattedDepartments,
      total: formattedDepartments.length
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get department by ID
app.get('/departments/:id', async (req, res) => {
  try {
    const { include_products = false } = req.query;
    
    const includeOptions = include_products === 'true' ? [{
      model: Product,
      as: 'products',
      attributes: ['id', 'name', 'price', 'image_url', 'description'],
      order: [['created_at', 'DESC']]
    }] : [];
    
    const department = await Department.findByPk(req.params.id, {
      attributes: ['id', 'name', 'created_at', 'updated_at'],
      include: includeOptions
    });
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    const departmentData = {
      id: department.id,
      name: department.name,
      created_at: department.created_at,
      updated_at: department.updated_at
    };
    
    if (include_products === 'true') {
      departmentData.products = department.products || [];
      departmentData.product_count = department.products ? department.products.length : 0;
    } else {
      departmentData.product_count = department.products ? department.products.length : 0;
    }
    
    res.status(200).json(departmentData);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new department
app.post('/departments', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        error: 'Missing required field',
        required: ['name'],
        received: { name }
      });
    }
    
    // Validate name is not empty
    if (name.trim() === '') {
      return res.status(400).json({ 
        error: 'Department name cannot be empty' 
      });
    }
    
    // Check if department already exists
    const existingDepartment = await Department.findOne({
      where: { name: name.trim() }
    });
    
    if (existingDepartment) {
      return res.status(409).json({ 
        error: 'Department already exists',
        department: {
          id: existingDepartment.id,
          name: existingDepartment.name
        }
      });
    }
    
    // Create the department
    const department = await Department.create({
      name: name.trim()
    });
    
    res.status(201).json({
      message: 'Department created successfully',
      department: {
        id: department.id,
        name: department.name,
        created_at: department.created_at,
        updated_at: department.updated_at
      }
    });
    
  } catch (error) {
    console.error('Error creating department:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'Department name must be unique',
        details: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update department
app.put('/departments/:id', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        error: 'Missing required field',
        required: ['name'],
        received: { name }
      });
    }
    
    // Validate name is not empty
    if (name.trim() === '') {
      return res.status(400).json({ 
        error: 'Department name cannot be empty' 
      });
    }
    
    const department = await Department.findByPk(req.params.id);
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Check if new name conflicts with existing department
    const existingDepartment = await Department.findOne({
      where: { 
        name: name.trim(),
        id: { [sequelize.Op.ne]: req.params.id }
      }
    });
    
    if (existingDepartment) {
      return res.status(409).json({ 
        error: 'Department name already exists',
        department: {
          id: existingDepartment.id,
          name: existingDepartment.name
        }
      });
    }
    
    // Update the department
    await department.update({
      name: name.trim()
    });
    
    res.status(200).json({
      message: 'Department updated successfully',
      department: {
        id: department.id,
        name: department.name,
        created_at: department.created_at,
        updated_at: department.updated_at
      }
    });
    
  } catch (error) {
    console.error('Error updating department:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'Department name must be unique',
        details: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete department
app.delete('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id']
      }]
    });
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Check if department has products
    if (department.products && department.products.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete department with existing products',
        product_count: department.products.length,
        message: 'Please reassign or delete all products in this department first'
      });
    }
    
    // Delete the department
    await department.destroy();
    
    res.status(200).json({
      message: 'Department deleted successfully',
      department: {
        id: department.id,
        name: department.name
      }
    });
    
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await testConnection();
    res.json({ status: 'healthy', message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database
    await syncDatabase();
    
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` API Documentation:`);
      console.log(`   GET /products - List all products`);
      console.log(`   GET /products/:id - Get product by ID`);
      console.log(`   POST /products - Create new product`);
      console.log(`   GET /departments - List all departments`);
      console.log(`   GET /departments/:id - Get department by ID`);
      console.log(`   POST /departments - Create new department`);
      console.log(`   PUT /departments/:id - Update department`);
      console.log(`   DELETE /departments/:id - Delete department`);
      console.log(`   GET /health - Health check`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 
