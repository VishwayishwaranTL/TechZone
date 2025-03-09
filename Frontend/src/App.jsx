import HomePage from './assets/pages/homePage.jsx'
import Navbar from './assets/pages/navbar.jsx'
import ProductPage from './assets/pages/productPage.jsx'
import SigninPage from './assets/pages/signinPage.jsx'
import LoginPage from './assets/pages/loginPage.jsx'
import { BrowserRouter,Route, Routes } from 'react-router-dom'
import CartPage from './assets/pages/cartPage.jsx'
import UserPage from './assets/pages/userPage.jsx'
import AdminPage from './assets/pages/adminPage.jsx'
import ProductIdPage from './assets/pages/productIdPage.jsx'
import { useEffect, useState } from 'react'
import CheckoutPage from './assets/pages/checkoutPage.jsx'
import PaymentSuccess from './assets/pages/paymentSuccessPage.jsx'
import MyOrders from './assets/pages/myOrderPage.jsx'
import AdminUserPage from './assets/pages/adminUserPage.jsx'
import AdminDashboard from './assets/pages/dashboard.jsx'
import BackButton from './assets/components/backButton.jsx'

function App() {
  const [cart, setCart] = useState(() => {
      try {
          const storedCart = localStorage.getItem("cart");
          return storedCart ? JSON.parse(storedCart) : {};
      } catch (error) {
          console.error("Error getting cart from localStorage:", error);
          return {};
      }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart)); 
}, [cart]);

  return (
    <BrowserRouter>
      <Navbar />
      <BackButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/user/" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/product/:id" element={<ProductIdPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/admin/user" element={<AdminUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
