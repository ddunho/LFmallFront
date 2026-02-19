import { Navigate, Route, Routes } from "react-router-dom";
import LoginView from "./pages/LoginView";
import SignUpView from "./pages/SignUpView";
import Detail from "./pages/Detail";
import SearchView from "./pages/SearchView";
import ListView from "./pages/ListView";
import Cart from './pages/Cart';
import DetailCopy from "./pages/DetailCopy";
import { useState } from "react";
import ProductDetail from "./pages/ProductDetail";
import { CartPriceProvider } from "./CartPriceContext";
import Payment from "./components/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/menu/0" replace />} />
      <Route path="/app/login" element={<LoginView />} />
      <Route path="/app/signup" element={<SignUpView />} />
      <Route path="/app/cart" element={<Cart pageinfo={1} />} />
      <Route path="/app/order" element={<Cart pageinfo={2} />} />
      <Route path="/app/order/complete" element={<Cart pageinfo={3} />} />
      <Route path="/app/search/result/:query" element={<SearchView />} />
      <Route path="/app/exhibition/:cate" element={<ListView />} />
      <Route path="/app/menu/:categoryId" element={<ListView />} />
      <Route path="/app/product/:productId" element={<ProductDetail />} />
      <Route path="/app/payment" element={<Payment />} />

      <Route path="/payment/success" element={<PaymentSuccess />}/>
      <Route path="/payment/fail" element={<PaymentFail />}/>
    </Routes>
  );
};

export default AppRoutes;
