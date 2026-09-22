export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api';

export const api = {
  async register(data: any) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    return response.json();
  },

  async login(data: any) {
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const result = await response.json();
    localStorage.setItem('token', result.access_token);
    return result;
  },

  async getMe() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async adminLogin(data: any) {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Admin login failed');
    }
    const result = await response.json();
    localStorage.setItem('adminToken', result.access_token);
    return result;
  },

  async getAdminStats() {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No admin token');
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return response.json();
  },

  async getAdminUsers() {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No admin token');
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async deleteUser(userId: string) {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No admin token');
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete user');
    }
    return response.json();
  },

  async getUserProfile(userId: string) {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No admin token');
    const response = await fetch(`${API_URL}/admin/users/${userId}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },

  async updateUser(userId: string, data: any) {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No admin token');
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update user');
    }
    return response.json();
  },

  async toggleUserStatus(userId: string, status: string) {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No admin token');
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update user status');
    }
    return response.json();
  }
};
