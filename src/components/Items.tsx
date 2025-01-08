import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios.ts';
import { Item } from '../models/Item.ts';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { useCart } from "../hooks/useCart.ts";

function Items() {
  const [data, setData] = useState<Item[]>([]);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    axiosInstance.get('/items')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddToCart = (item: Item) => {
    const quantity = quantities[item.id] || 1;
		console.log(item)
		console.log(quantity)

    addToCart(item, quantity);
  };

  if (!data.length) return null;

  return (
    <Grid container spacing={3}>
      {data.map((item) => (
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
                onClick={() => handleAddToCart(item)}
              >
                Add to cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Items;
