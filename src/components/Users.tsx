import { FunctionComponent, useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
} from '@mui/material'
import axiosInstance from '../api/axios.ts'
import { User } from '../types/types.ts'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import UserFormDialog from './dialogs/UserFormDialog.tsx'

const Users: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const [userDataToForm, setUserDataToForm] = useState<User>();
  const userRole = localStorage.getItem('userRole') || 'user';

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    axiosInstance
      .get('/users',
        {
       		headers: {
						Authorization: `Bearer ${token}`
					}
      	})
      .then((response) => {
        setUsers(response.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('An error occurred when fetching data. Please check the API and try again.');
        setIsLoading(false);
      });
  }, []);

  const handleClickOpen = (user?: User) => {
    setOpen(true);
    user && setUserDataToForm(user);
  };

  const handleClose = (value?: User) => {
    setOpen(false);

    if (value) {
      const token = localStorage.getItem('authToken');
      !value.id ? createNewUser(value, token) : updateUser(value, token);
    } else {
      return;
    }
  };

  const updateUser = (value: User, token: string | null) => {
    axiosInstance
      .put(`/users/${value.id}`,
        {
          user: {
            fisrt_name: value.first_name,
            last_name: value.last_name,
            email: value.email,
            role: value.role,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedUser = response.data;
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setSuccess('User was updated successfully!');
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };

  const createNewUser = (value: User, token: string | null) => {
    axiosInstance
      .post(
        '/users',
        {
          user: {
            fisrt_name: value.first_name,
            last_name: value.last_name,
            email: value.email,
            role: value.role,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const newUser = response.data;
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setSuccess('New User was created successfully!');
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };

  const handleDeleteUser = (id?: number) => {
    if (id) {
      const token = localStorage.getItem('authToken');
      axiosInstance
        .delete(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          setSuccess('User was deleted successfully!');
        })
        .catch((error) => {
          setError(error.response.data.error);
        });
    } else {
      setError('Invalid user ID.');
      return;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <div className="usersHeader">
        <h1>Users</h1>
				{/* <Button
					onClick={() => {
						handleClickOpen({ first_name: '', email: '', role: 'user' } as User);
					}}
				>
					<p style={{ fontSize: '32px', margin: '0' }}>+</p>
				</Button> */}
        <UserFormDialog open={open} userData={userDataToForm} onClose={handleClose} />
      </div>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid key={user.id}>
            <Card sx={{ minWidth: 300, maxWidth: 400 }} style={{ margin: 10 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {user.first_name} {user.last_name}
                  {/* {userRole === 'admin' && (
                    <>
                      <Button onClick={() => handleClickOpen(user)}>
                        <EditIcon sx={{ color: '#1976d2', mr: 1 }} />
                      </Button>
                      <Button onClick={() => handleDeleteUser(user.id)}>
                        <DeleteIcon sx={{ color: '#1976d2', mr: 1 }} />
                      </Button>
                    </>
                  )} */}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {user.email}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  Role: {user.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Users
