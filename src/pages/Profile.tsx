import React from 'react'
import axiosInstance from '../api/axios.ts';

function Profile() {

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/profile');
      console.log('Profile Data:', response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

	const updateProfile = async (updatedData) => {
		try {
			const response = await axiosInstance.put('/profile', updatedData);
			console.log('Updated Profile:', response.data);
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};

  return (
    <div>
			<p>Profile</p>
    </div>
  )
}

export default Profile
