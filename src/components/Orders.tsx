import { FunctionComponent, useEffect, useState } from 'react'
import axiosInstance from '../api/axios.ts';
import { Card, CardContent, Grid, Typography, CardActionArea } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Order } from '../types/types.ts';

const Orders: FunctionComponent = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(false)
	
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('authToken');

		axiosInstance.get('/orders',
			{ headers: 
			  { Authorization: `Bearer ${token}`}
			})
			.then(response => {
				setOrders(response.data);
				setIsLoading(false)
			})
			.catch(() => {
				setError(true)
				setIsLoading(false)
			});
	}, []);

	const handleOpenOrder = (id: Number) => {
		const url = '/orders/' + id.toString()
		navigate(url)
	}

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
					<Card onClick={() => { handleOpenOrder(order.id) }}
						sx={{ minWidth: 300, maxWidth: 400 }}
						style={{ margin: 10 }}>
						<CardActionArea>
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									Order # {order.id}
								</Typography>
								<Typography variant="body1" sx={{ color: 'text.secondary' }}>
									Total Price: ${order.amount}
								</Typography>
							</CardContent>
						</CardActionArea>
						
					</Card>
				</Grid>
			))}
		</Grid>
	</>
  )
}

export default Orders;
