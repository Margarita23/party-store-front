import { FunctionComponent, useEffect, useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { CartProps } from '../interfaces/interfaces'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Alert
} from '@mui/material'
import axiosInstance from '../api/axios.ts'
import { Item, NewItemModel } from '../types/types.ts'
import ItemFormDialog from './dialogs/ItemFormDialog.tsx'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';

const Items: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cart, setCart] = useLocalStorageState<CartProps>('cart', {})
  const userRole = localStorage.getItem('userRole') || "user"
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [open, setOpen] = useState(false)
  const [itemDataToForm, setItemDataToForm] = useState<NewItemModel>()
  useEffect(() => {
    axiosInstance.get('/items')
      .then(response => {
        setItems(response.data)
        setIsLoading(false)
      })
      .catch(() => {
        setError("An error occurred when fetching data. Please check the API and try again.")
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (error) {
      setError("An error occurred when fetching data. Please check the API and try again.")
      return
    }
  }, [error])

  const handleQuantityChange = (itemId: number, quantity: number): void => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }))
  }

  const addToCart = (product: Item, quant: number):void => {

    setCart((prevCart: any) => {
      if (prevCart[product.id]) {
        return {
          ...prevCart,
          [product.id]: {
            ...prevCart[product.id],
            quantity: prevCart[product.id].quantity + quant,
          },
        }
      }
  
      return {
        ...prevCart,
        [product.id]: {
          ...product,
          quantity: quant,
        },
      }
    })

    let successMessage = `You added item named '${product.name}' with quantity '${quant}' to your cart successfully!`

    setSuccess(successMessage)
  }

  const handleClickOpen = (item?: NewItemModel) => {
    setOpen(true)
    item && setItemDataToForm(item)
  }

  const handleClose = (value?: NewItemModel) => {
    setOpen(false)

    if (value) {
      const token = localStorage.getItem('authToken');
      !value.id ? createNewItem(value, token) : updateItem(value, token)
    } else {
      return
    }
  }

  const updateItem = (value: NewItemModel, token: string | null) => {
    axiosInstance.put(`/items/${value.id}`,
      {
        item: {
          name: value.name,
          description: value.description,
          price: value.price
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        const updatedItem = response.data

        setItems((prevItems) =>
          prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        )
        setSuccess("Item was updated successfully!")
      }).catch((error) => {
        setError(error.response.data.error)
      })
  }

  const createNewItem = (value: NewItemModel, token: string | null) => {
    axiosInstance.post('/items',
      {
        item: {
          name: value.name,
          description: value.description,
          price: value.price
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        const newItem = response.data
        setItems((prevItems) => [...prevItems, newItem])
        setSuccess("New Item was created successfully!")
      }).catch((error) => {
        setError(error.response.data.error)
      })
  }

  const handleDeleteItem = (id: number) => {
    if (id) {
      const token = localStorage.getItem('authToken');
      axiosInstance.delete(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
          setItems((prevItems) => prevItems.filter((item) => item.id !== id))
          setSuccess("Item was deleted successfully!")
      }).catch((error) => {
          setError(error.response.data.error)
        })
    } else {
      setError("Invalid item ID.")
      return
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    {error && <Alert severity="error">{error}</Alert>}
    {success && <Alert severity="success">{success}</Alert>}
    <div className="itemsHeader">
      <h1>Items</h1>
      {userRole === 'admin' && (
        <Button
          onClick={() => { handleClickOpen({name: "",
            description: "",
            price: 0} as NewItemModel) }}
        >
          <p style={{ fontSize: '32px', margin: '0' }}>+</p>
        </Button>
      )}
      <ItemFormDialog
        open={open}
        itemData={itemDataToForm}
        onClose={handleClose}
      />
    </div>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid key={item.id}>
            <Card sx={{ minWidth: 300, maxWidth: 400 }} style={{ margin: 10 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}

                  {userRole === 'admin' && (
                    <>
                      <Button onClick={() => { handleClickOpen(item) }}>
                        <EditIcon sx={{ color: '#1976d2', mr: 1 }} />
                      </Button>

                      <Button onClick={()=> { handleDeleteItem(item.id) }}>
                        <DeleteIcon sx={{ color: '#1976d2', mr: 1 }} />
                      </Button>
                    </>
                  )}
                
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
