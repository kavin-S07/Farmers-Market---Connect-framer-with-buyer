const fs = require('fs');
const path = require('path');

const structure = [
  'frontend/public',
  'frontend/src/api',
  'frontend/src/components/common',
  'frontend/src/components/auth',
  'frontend/src/components/product',
  'frontend/src/components/order',
  'frontend/src/pages/auth',
  'frontend/src/pages/buyer',
  'frontend/src/pages/farmer',
  'frontend/src/context',
  'frontend/src/utils'
];

const files = [
  'frontend/public/index.html',
  'frontend/public/favicon.ico',

  'frontend/src/api/axiosConfig.js',
  'frontend/src/api/authApi.js',
  'frontend/src/api/productApi.js',
  'frontend/src/api/orderApi.js',
  'frontend/src/api/userApi.js',

  'frontend/src/components/common/Navbar.jsx',
  'frontend/src/components/common/Footer.jsx',
  'frontend/src/components/common/ProtectedRoute.jsx',
  'frontend/src/components/common/Loading.jsx',
  'frontend/src/components/common/ErrorMessage.jsx',

  'frontend/src/components/auth/LoginForm.jsx',
  'frontend/src/components/auth/SignupForm.jsx',

  'frontend/src/components/product/ProductCard.jsx',
  'frontend/src/components/product/ProductList.jsx',
  'frontend/src/components/product/ProductDetail.jsx',
  'frontend/src/components/product/ProductForm.jsx',

  'frontend/src/components/order/OrderCard.jsx',
  'frontend/src/components/order/OrderList.jsx',
  'frontend/src/components/order/OrderDetail.jsx',

  'frontend/src/pages/auth/LoginPage.jsx',
  'frontend/src/pages/auth/SignupPage.jsx',

  'frontend/src/pages/buyer/BuyerDashboard.jsx',
  'frontend/src/pages/buyer/BrowseProducts.jsx',
  'frontend/src/pages/buyer/MyOrders.jsx',
  'frontend/src/pages/buyer/OrderDetails.jsx',

  'frontend/src/pages/farmer/FarmerDashboard.jsx',
  'frontend/src/pages/farmer/MyProducts.jsx',
  'frontend/src/pages/farmer/AddProduct.jsx',
  'frontend/src/pages/farmer/EditProduct.jsx',
  'frontend/src/pages/farmer/ReceivedOrders.jsx',
  'frontend/src/pages/farmer/SalesHistory.jsx',

  'frontend/src/pages/HomePage.jsx',
  'frontend/src/pages/NotFound.jsx',

  'frontend/src/context/AuthContext.jsx',

  'frontend/src/utils/constants.js',
  'frontend/src/utils/helpers.js',

  'frontend/src/App.jsx',
  'frontend/src/App.css',
  'frontend/src/index.js',
  'frontend/src/index.css',

  'frontend/package.json',
  'frontend/.env'
];

// Create folders
structure.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

// Create files with placeholder content
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  fs.writeFileSync(filePath, `// ${path.basename(file)}\n`);
});

console.log('✅ Frontend folder structure created successfully!');
