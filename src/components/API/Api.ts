import axios from 'axios';

// Example API endpoint for task creation and user fetching
const API_URL = 'http://192.168.11.71:8008'; // Replace with your API base URL

// Fetch users from the backend API
export const fetchUsers = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data; // Assume response.data is an array of users
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

// Add a task to the backend API
export const addTask = async (task: any) => {
  try {
    await axios.post(`${API_URL}/tasks/`, task, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if needed
      },
    });
  } catch (error) {
    throw new Error('Failed to add task');
  }
};
