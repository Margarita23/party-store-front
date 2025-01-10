import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Items from './components/Items'
// import { Footer } from './components/Footer'
import Cart from './components/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'
import Orders from './components/Orders'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route
              path="/orders"
              element={<Orders />}
            />
            <Route
              path="/items"
              element={<Items />}
            />
            <Route
              path="/cart"
              element={<Cart />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>
          
        </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default App;
