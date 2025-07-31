#!/bin/bash

echo " Setting up E-commerce React Frontend..."
echo "=========================================="

if ! command -v node &> /dev/null; then
    echo " Node.js is not installed. Please install Node.js first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo " Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo " Node.js version: $(node -v)"


echo " Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo " Dependencies installed successfully!"
else
    echo " Failed to install dependencies"
    exit 1
fi

echo ""
echo " Setup completed successfully!"
echo ""
echo " Next steps:"
echo "   1. Make sure your backend API is running on http://localhost:3000"
echo "   2. Start the frontend development server:"
echo "      npm run dev"
echo "   3. Open http://localhost:3001 in your browser"
echo ""
echo " Tips:"
echo "   - The frontend will automatically reload when you make changes"
echo "   - Check the browser console for any API connection issues"
echo "   - Use the Network tab in dev tools to debug API calls" 
