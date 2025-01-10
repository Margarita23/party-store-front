import { FunctionComponent, useState } from 'react'
import { Operation } from '../types/types'
import { Box, IconButton, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  removeProductCallback: (productId: number) => void
  handleUpdateQuantity: (productId: number, operation: Operation) => void
  productId: number
  quantity: number
}

const Quantifier: FunctionComponent<Props> = ({ removeProductCallback, handleUpdateQuantity, productId, quantity }) => {
  const [value, setValue] = useState<number>(quantity)

  const reduce = ():void => {
    handleUpdateQuantity(productId, 'decrease')

    setValue(prevState => {
      const updatedValue = prevState - 1
      if (updatedValue === 0) {
        removeProductCallback(productId)
      }
      return updatedValue
    })
  }

  const increase = ():void => {
    handleUpdateQuantity(productId, 'increase')
    setValue(prevState => prevState + 1)
  }

  return (
    <Box display="flex" alignItems="center" mt={1}>
      <IconButton
        aria-label="Decrease quantity"
        onClick={reduce}
        size="small"
      >
        <RemoveIcon />
      </IconButton>

      <Typography variant="body1" mx={2}>
        { value }
      </Typography>
    
      <IconButton
        aria-label="Increase quantity"
        onClick={increase}
        size="small"
      >
        <AddIcon />
      </IconButton>
    </Box>
  )
}

export default Quantifier;
