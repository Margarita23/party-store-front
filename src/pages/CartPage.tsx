import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useCart } from '../hooks/useCart.ts'
import CartItem from '../components/CartItem.tsx';

function CartPage() {
  const { items, totalPrice, clearCart } = useCart();

  const confirmPayment = () => {
    console.log("I payed for all of items!");
    clearCart();
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {Object.keys(items).length === 0 ? (
        <Typography variant="body1">There are no products in your cart.</Typography>
      ) : (
        <Box>
          {Object.values(items).map(({ item, quantity }) => (
            <CartItem key={item.id} item={{ item, quantity }} />
          ))}
          <Typography variant="h6" mt={2}>
            Total: ${totalPrice()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={confirmPayment}
            style={{ marginTop: '16px' }}
          >
            Complete Purchase
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CartPage
