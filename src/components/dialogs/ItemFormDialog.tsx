import { useState, useEffect, ChangeEvent } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import { ItemNewFormProps } from '../../interfaces/interfaces'
import { NewItemModel, NewItemModelErrors } from '../../types/types'

function ItemFormDialog(props: ItemNewFormProps) {
  const { onClose, open, itemData } = props

  const [formData, setFormData] = useState<NewItemModel>({
    name: '',
    description: '',
    price: 0,
  })

  const [errors, setErrors] = useState<Partial<NewItemModelErrors>>({})

  useEffect(() => {
    if (itemData) {
      setFormData(itemData);
    } else {
      setFormData({ name: '', description: '', price: 0 });
    }
  }, [itemData]);

  const handleClose = (newItemModel?: NewItemModel) => {
    onClose(newItemModel)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: NewItemModelErrors = {
      name: '',
      description: '',
      price: ''
    }

    if (!formData.name) {
      newErrors.name = 'Name is required.'
    }
    if (!formData.description) {
      newErrors.description = 'Description is required.'
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0.'
    }

    setErrors(newErrors)

    return !newErrors.name && !newErrors.description && !newErrors.price
  };

  const handleSubmit = () => {
    if (validateForm()) {      
      onClose(formData)
    }
  }

  return (
    <Dialog onClose={ () => { handleClose() } } open={open}>
      <DialogTitle>{itemData?.name === "" ? "Create New" : "Update"} Item</DialogTitle>
      <DialogContent>
        <TextField
          required
          fullWidth
          margin="dense"
          label="Item Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          required
          fullWidth
          margin="dense"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          required
          fullWidth
          margin="dense"
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
          inputProps={{
            step: 0.01,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={ () => { handleClose() } } color="secondary">
          Cancel
        </Button>
        <Button onClick={ handleSubmit } color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ItemFormDialog
