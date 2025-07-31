const axios = require('axios');

const BASE_URL = 'http://localhost:3000';


const newProduct = {
  name: "Test Product",
  description: "This is a test product for API testing",
  price: 29.99,
  department: "Clothes",
  image_url: "https://example.com/image.jpg"
};

const testAPI = async () => {
  console.log(' Testing E-commerce API...\n');

  try {

    console.log(' Testing GET /products');
    const response1 = await axios.get(`${BASE_URL}/products`);
    console.log(' Success:', response1.status);
    console.log(`   Found ${response1.data.total} products\n`);

    console.log(' Testing POST /products');
    const response2 = await axios.post(`${BASE_URL}/products`, newProduct);
    console.log(' Success:', response2.status);
    console.log(`   Created product with ID: ${response2.data.product.id}\n`);

    const productId = response2.data.product.id;
    console.log(` Testing GET /products/${productId}`);
    const response3 = await axios.get(`${BASE_URL}/products/${productId}`);
    console.log(' Success:', response3.status);
    console.log(`   Product: ${response3.data.name} - $${response3.data.price}\n`);


    console.log(' Testing POST /products with missing fields');
    try {
      await axios.post(`${BASE_URL}/products`, { name: "Test" });
    } catch (error) {
      console.log(' Expected error:', error.response.status);
      console.log(`   Error: ${error.response.data.error}\n`);
    }


    console.log(' Testing POST /products with invalid price');
    try {
      await axios.post(`${BASE_URL}/products`, {
        name: "Test Product",
        price: -10,
        department: "Electronics"
      });
    } catch (error) {
      console.log(' Expected error:', error.response.status);
      console.log(`   Error: ${error.response.data.error}\n`);
    }

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error(' Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log(' Make sure the server is running on http://localhost:3000');
    }
  }
};

if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 
