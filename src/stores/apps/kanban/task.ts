import axios from 'axios';

const API_URL = 'http://192.168.11.71:8008/tasks/';
const token = sessionStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8';

export interface TaskApiItem {
  TaskId: number;
  Title: string;
  DueDate: string;
  AssignedTo: string;
  Description: string;
  Status: string;
  Priority: string;
  OrganizationId: number;
  SubOrganizationId: number;
  CreatedBy: string;
  ModifiedBy: string;
  RecId: number;
}

// ========== GET ==========
// Fetch tasks from API and store them in sessionStorage
export const fetchTasksFromApi = async (): Promise<TaskApiItem[]> => {
  try {
    const response = await axios.get<TaskApiItem[]>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    sessionStorage.setItem('allTasks', JSON.stringify(response.data)); // Store tasks in sessionStorage
    return response.data;
  } catch (err) {
    console.error('Error fetching tasks:', err);
    alert('Failed to fetch tasks. Please ensure you are authorized.');
    return [];
  }
};

// Get stored tasks from sessionStorage (if available)
export const getStoredTasks = (): TaskApiItem[] => {
  const tasks = sessionStorage.getItem('allTasks');
  return tasks ? JSON.parse(tasks) : [];
};

// ========== POST ==========
// Create a new task and add it to sessionStorage
export const createTask = async (task: Omit<TaskApiItem, 'TaskId'>): Promise<TaskApiItem | null> => {
  try {
    const response = await axios.post<TaskApiItem>(API_URL, task, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const updatedTasks = [...getStoredTasks(), response.data];
    sessionStorage.setItem('allTasks', JSON.stringify(updatedTasks)); // Update sessionStorage
    return response.data;
  } catch (err) {
    console.error('Error creating task:', err);
    alert('Failed to create task.');
    return null;
  }
};

// ========== PUT ==========
// Update an existing task and update sessionStorage
export const updateTask = async (taskId: number, updatedTask: Partial<TaskApiItem>): Promise<TaskApiItem | null> => {
  try {
    const response = await axios.put<TaskApiItem>(`${API_URL}${taskId}/`, updatedTask, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const tasks = getStoredTasks().map(task =>
      task.TaskId === taskId ? response.data : task
    );
    sessionStorage.setItem('allTasks', JSON.stringify(tasks)); // Update sessionStorage
    return response.data;
  } catch (err) {
    console.error('Error updating task:', err);
    alert('Failed to update task.');
    return null;
  }
};

// ========== DELETE ==========
// Delete a task and update sessionStorage
export const deleteTask = async (taskId: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}${taskId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updatedTasks = getStoredTasks().filter(task => task.TaskId !== taskId);
    sessionStorage.setItem('allTasks', JSON.stringify(updatedTasks)); // Update sessionStorage
    return true;
  } catch (err) {
    console.error('Error deleting task:', err);
    alert('Failed to delete task.');
    return false;
  }
};
