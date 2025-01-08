import React, {useState, useEffect} from 'react';
import { Button, IconButton, Typography, Box } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../hooks/useCart.ts';
import { CartItemProps } from '../interfaces/interfaces.ts';

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [ quantity, setQuantity ] = useState(item.quantity)

  const handleDecrease = () => {
    const newQuantity = quantity - 1;
    if (newQuantity > 0) {
      updateQuantity(item.item.id, newQuantity);

      setQuantity(newQuantity);
    } else {
      removeFromCart(item.item.id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.item.id, quantity + 1);
    setQuantity(quantity + 1);
  };

  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Box flex="1">
        <Typography variant="h6">{item.item.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          ${item.item.price}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <IconButton
            aria-label="Decrease quantity"
            onClick={handleDecrease}
            size="small"
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="body1" mx={2}>
            { quantity }
          </Typography>
          <IconButton
            aria-label="Increase quantity"
            onClick={handleIncrease}
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => removeFromCart(item.item.id)}
        style={{ marginLeft: '16px' }}
      >
        Remove
      </Button>
    </Box>
  );
};

export default CartItem;
