import { FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { PropsWidget } from '../interfaces/interfaces';
import { Button, Typography } from '@mui/material';

const CartWidget: FunctionComponent<PropsWidget> = ({ itemsCount }) => {
  const navigate = useNavigate()

  const navigateToCart = () => {
    navigate('/cart')
  }

  return (
    <Button onClick={navigateToCart}>
        <Typography sx={{ textAlign: 'center', color: 'white' }}>{itemsCount}</Typography>
        <ShoppingCartIcon sx={{ color: 'white', display: { xs: 'flex', md: 'none' }, mr: 1 }} />
    </Button>
  )
}

export default CartWidget;
