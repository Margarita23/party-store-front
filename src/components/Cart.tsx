import {
  FunctionComponent,
  useEffect,
  useState
} from 'react'
import useLocalStorageState from 'use-local-storage-state'

import { CartProps } from '../interfaces/interfaces'
import { useLocation } from 'react-router-dom'
import { Operation } from '../types/types'
import Quantifier from './Quantifier'
import { TotalPrice } from './TotalPrice'
import {
  Box,
  Button,
  Typography,
  Alert
} from '@mui/material'
import axiosInstance from '../api/axios'

const Cart: FunctionComponent = () => {
  const [cart, setCart] = useLocalStorageState<CartProps>('cart', {})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [info, setInfo] = useState("")
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const handleRemoveProduct = (productId: number): void => {
    setCart((prevCart: any) => {
      const updatedCart = { ...prevCart }
      const deletedItem = updatedCart[productId]
      delete updatedCart[productId]

      let infoMessage = `You removed '${deletedItem.name}' (quantity: ${deletedItem.quantity}) from your cart.`

      setInfo(infoMessage)
      return updatedCart
    })
  }

  const handleUpdateQuantity = (productId: number, operation: Operation) => {
    setCart((prevCart: any) => {
      const updatedCart = { ...prevCart }
      if (updatedCart[productId]) {
        if (operation === 'increase') {
          updatedCart[productId] = { ...updatedCart[productId], quantity: updatedCart[productId].quantity + 1 }
        } else {
          updatedCart[productId] = { ...updatedCart[productId], quantity: updatedCart[productId].quantity - 1 }
        }
      }
      return updatedCart
    })
  }

  const confirmPayment = async () => {
    const itemsInCart = Object.values(cart || {})
    const token = localStorage.getItem('authToken')
    const orderPayload = {
      amount: totalPrice,
      order_descriptions_attributes: itemsInCart.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
      }))
    }

    try {
      await axiosInstance.post('/orders',
      {
        order: orderPayload
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    } catch (error: any) {
      setError(error.response.data.error)
    } finally {
      setError("")
      setInfo("")
      setSuccess("Your order was created successfully!")
      localStorage.removeItem("cart")
      clearCart()
    }
    
  }

  const clearCart = () => {
    setCart({})
  }

  const getItems = () => Object.values(cart || {})

  const totalPrice = getItems().reduce((accumulator, item) => accumulator + (item.price * item.quantity), 0)

  return (
    <section>

      {info && <Alert severity="info">{info}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <h1>Cart</h1>

      <div>
        {getItems().map(item => (

          <Box display="flex" alignItems="center" mb={2} key={item.id}>
            <Box flex="1">
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                ${item.price}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
              <Quantifier
                removeProductCallback={() => handleRemoveProduct(item.id)}
                productId={item.id}
                quantity={item.quantity}
                handleUpdateQuantity={handleUpdateQuantity} />
            </Box>
            </Box>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRemoveProduct(item.id)}
              style={{ marginLeft: '16px' }}
            >
              Remove
            </Button>
          </Box>
        ))}
      </div>
      <TotalPrice amount={totalPrice} />
      <Button
            variant="contained"
            color="primary"
            onClick={confirmPayment}
            style={{ marginTop: '16px' }}
          >
            Complete Purchase
          </Button>
    </section>
  )
}

export default Cart
