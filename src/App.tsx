import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Items from './components/Items.tsx';
import Layout from './components/Layout.tsx';
import PageNotFound from './components/PageNotFound.tsx';
import Profile from './pages/Profile.tsx';
import CartPage from './pages/CartPage.tsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="items" element={<Items />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
