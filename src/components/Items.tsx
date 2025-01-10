import { FunctionComponent, useEffect, useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'

import { Item } from '../models/Item'
import { CartProps } from '../interfaces/interfaces'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import axiosInstance from '../api/axios.ts';

const Items: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState(false)
  const [cart, setCart] = useLocalStorageState<CartProps>('cart', {})
  const userRole = localStorage.getItem('userRole') || "user"
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  useEffect(() => {
    axiosInstance.get('/items')
      .then(response => {
        setItems(response.data);
        setIsLoading(false)
      })
      .catch(() => {
        setError(true)
        setIsLoading(false)
      });
  }, []);

  const handleQuantityChange = (itemId: number, quantity: number): void => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }))
  }

  const addToCart = (product: Item, quant: number):void => {
    const quantity = quant

    setCart((prevCart: any) => {
      if (prevCart[product.id]) {
        return {
          ...prevCart,
          [product.id]: {
            ...prevCart[product.id],
            quantity: prevCart[product.id].quantity + quantity,
          },
        };
      }
  
      return {
        ...prevCart,
        [product.id]: {
          ...product,
          quantity: quantity,
        },
      };
    });
    
  }

  const createItems = ():void => {
    console.log('+')
  }

  if (error) {
    return <h3>An error occurred when fetching data. Please check the API and try again.</h3>
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="itemsHeader">
      <h1>Items</h1>
      {userRole === 'admin' && (
        <Button
          onClick={() => createItems()}
        >
          <p style={{ fontSize: '32px', margin: '0' }}>+</p>
        </Button>
      )}
    </div>
      

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid key={item.id}>
            <Card sx={{ minWidth: 300, maxWidth: 400 }} style={{ margin: 10 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {item.description}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  ${item.price}
                </Typography>
              </CardContent>
              <CardActions>
                <input
                  type="number"
                  aria-label={`Quantity for ${item.name}`}
                  placeholder="1"
                  value={quantities[item.id] || 1}
                  min={1}
                  onChange={(e) => handleQuantityChange(item.id, Math.max(1, parseInt(e.target.value, 10)))}
                  style={{ width: '60px', marginRight: '10px' }}
                />
                <Button
                  size="small"
                  onClick={() => addToCart(item, quantities[item.id] || 1)}
                >
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Items;
