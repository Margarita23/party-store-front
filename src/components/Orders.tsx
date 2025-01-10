import { FunctionComponent, useEffect, useState } from 'react'
import axiosInstance from '../api/axios.ts';
import { Order } from '../models/Order.ts';
import { Card, CardContent, Grid, Typography } from '@mui/material';

const Orders: FunctionComponent = () => {
		const [orders, setOrders] = useState<Order[]>([])
		const [isLoading, setIsLoading] = useState(true)
		const [error, setError] = useState(false)

	useEffect(() => {
		axiosInstance.get('/orders')
			.then(response => {
				setOrders(response.data);
				setIsLoading(false)
			})
			.catch(() => {
				setError(true)
				setIsLoading(false)
			});
	}, []);

	if (error) {
		return <h3>An error occurred when fetching data. Please check the API and try again.</h3>
	  }

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (orders.length === 0) {
		return <div>You don't have any orders.</div>;
	}
		
  return (
	<>
		<h1>Orders</h1>

		<Grid container spacing={3}>
			{orders.map((order) => (
				<Grid key={order.id}>
				<Card sx={{ minWidth: 300, maxWidth: 400 }} style={{ margin: 10 }}>
					<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{order.id}
					</Typography>
					<Typography variant="body1" sx={{ color: 'text.secondary' }}>
						{order.amount}
					</Typography>
					</CardContent>
				</Card>
				</Grid>
			))}
		</Grid>
	</>
  )
}

export default Orders;
