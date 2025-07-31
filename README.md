#  E-Commerce Product Management API with Department Refactoring

This project is a simple **E-commerce Product Management System** that allows users to fetch, manage, and view products grouped by departments. It follows a RESTful API design using **Flask** (backend), **SQLite** (database), and **React.js** (frontend) to simulate a real-world inventory management use case.

---

##  Features

- View all products with department info
- Fetch a single product by ID
- Fetch all departments
- Fetch a single department by ID
- Fetch products under a specific department
- Proper error handling for invalid routes and IDs
- Refactored database using a normalized schema

---


---

## 📦 Technologies Used

**Backend**: Python, Flask, SQLAlchemy, SQLite  
**Frontend**: React.js, Axios, JavaScript, HTML, CSS  
**Tools**: Postman, Git, VSCode  

---

## 🗂 Database Design

### ✅ Refactoring Goals

- Extract `department` info into a separate table
- Maintain foreign key relationships
- Normalize data for scalability

### 🧱 Tables

#### `departments`
| id | name       |
|----|------------|
| 1  | Electronics|
| 2  | Clothing   |
| 3  | Books      |

#### `products`
| id | name       | price | department_id |
|----|------------|-------|---------------|
| 1  | Laptop     | 799   | 1             |
| 2  | T-shirt    | 19    | 2             |
| 3  | Novel      | 15    | 3             |

---

## 🔀 API Endpoints

### Products API

- `GET /api/products` – Get all products with department names
- `GET /api/products/<id>` – Get a single product by ID
- **Error Handling**: Returns 404 if product not found

### Departments API

- `GET /api/departments` – Fetch all departments  
- `GET /api/departments/<id>` – Fetch specific department  
- `GET /api/departments/<id>/products` – Products under that department  
- **Error Handling**: Handles invalid department IDs with clear messages

---

## 📊 Sample SQL Queries

```sql
-- Fetch all products with department names
SELECT products.id, products.name, products.price, departments.name AS department
FROM products
JOIN departments ON products.department_id = departments.id;

-- Count products per department
SELECT departments.name, COUNT(products.id) AS product_count
FROM products
JOIN departments ON products.department_id = departments.id
GROUP BY departments.id;


