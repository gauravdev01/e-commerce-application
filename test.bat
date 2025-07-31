@echo off
echo  Testing E-commerce API...
echo ================================

REM Test GET /products
echo 1. Testing GET /products
curl -s -X GET http://localhost:3000/products
if %errorlevel% equ 0 (
    echo  GET /products successful
) else (
    echo  GET /products failed
)

echo.

REM Test POST /products
echo 2. Testing POST /products
curl -s -X POST http://localhost:3000/products ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Quick Test Product\", \"description\": \"Product created during quick test\", \"price\": 19.99, \"department\": \"Electronics\"}"
if %errorlevel% equ 0 (
    echo  POST /products successful
) else (
    echo  POST /products failed
)

echo.

REM Test GET /products/1
echo 3. Testing GET /products/1
curl -s -X GET http://localhost:3000/products/1
if %errorlevel% equ 0 (
    echo  GET /products/1 successful
) else (
    echo  GET /products/1 failed
)

echo.
echo  Quick test completed!
pause 
