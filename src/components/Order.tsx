import { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axios.ts'
import {
	Card,
	CardContent,
	Grid,
	Typography,
	Box
} from '@mui/material'
import { OrderDetails } from '../types/types.ts'

const Order: FunctionComponent = () => {
	const { orderId } = useParams<{ orderId: string }>()
	const [orderDetails, setOrderDetails] = useState<OrderDetails>()
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		if (!orderId) {
			setError("Something went wrong...")
			setIsLoading(false)
			return
		}

		const token = localStorage.getItem('authToken')

		axiosInstance.get('/orders/' + orderId,
			{
				headers: 
			  	{ Authorization: `Bearer ${token}`}
			})
			.then(response => {
				setOrderDetails(response.data)
				setIsLoading(false)
			})
			.catch(() => {
				setError("Something went wrong...")
				setIsLoading(false)
			})
	}, [orderId])

	if (error) {
		return <h3>An error occurred when fetching data. Please check the API and try again.</h3>
	  }

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<Box p={3}>
			<Typography variant="h4" gutterBottom>
				Order #{orderDetails?.id}
			</Typography>
			<Typography variant="h5" gutterBottom>
				Total Price: ${orderDetails?.amount}
			</Typography>
			<Grid container spacing={2}>
				{orderDetails?.items?.map((item) => (
					<Grid item xs={12} sm={6} md={4} key={item.id}>
						<Card
							sx={{ maxWidth: 400 }}
							style={{ margin: 'auto' }}
						>
							<CardContent>
								<Typography gutterBottom variant="h6" component="div">
									{item.name}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{item.description}
								</Typography>
								<Typography variant="body1" color="text.primary" gutterBottom>
									Price: ${item.price}
								</Typography>
								<Typography variant="body1" color="text.primary">
									Quantity: {item.quantity}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default Order
