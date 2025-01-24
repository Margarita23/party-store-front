import { useState, useEffect, ChangeEvent } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material'
import { User } from '../../types/types'

interface UserFormProps {
  onClose: (userModel?: User) => void
  open: boolean
  userData?: User
}

const UserFormDialog: React.FC<UserFormProps> = (props) => {
  const { onClose, open, userData } = props

  const [formData, setFormData] = useState<User>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'user',
  })

  const [errors, setErrors] = useState<Partial<User>>({})

  useEffect(() => {
    if (userData) {
      setFormData(userData)
    } else {
      setFormData({ first_name: '', last_name: '', email: '', role: 'user' })
    }
  }, [userData])

  const handleClose = (userModel?: User) => {
    onClose(userModel)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<User> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required.'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onClose(formData)
    }
  }

  return (
    <Dialog onClose={() => handleClose()} open={open}>
      <DialogTitle>{userData?.id ? 'Update' : 'Create New'} User</DialogTitle>
      <DialogContent>
        <TextField
          required
          fullWidth
          margin="dense"
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={!!errors.first_name}
          helperText={errors.first_name}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <TextField
          required
          fullWidth
          margin="dense"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          select
          fullWidth
          margin="dense"
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserFormDialog
