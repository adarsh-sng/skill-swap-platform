const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }

  // Helper method to make API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async browseUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/browse?${queryString}`);
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  async searchUsersBySkill(skill, type = 'offered') {
    return this.request(`/users/search/skills?skill=${encodeURIComponent(skill)}&type=${type}`);
  }

  async getPopularSkills() {
    return this.request('/users/skills/popular');
  }

  async getStats() {
    return this.request('/users/stats/overview');
  }

  // Swap request endpoints
  async createSwapRequest(swapData) {
    return this.request('/swaps/request', {
      method: 'POST',
      body: JSON.stringify(swapData)
    });
  }

  async getSwapRequests() {
    return this.request('/swaps');
  }

  async getMyRequests() {
    return this.request('/swaps/my-requests');
  }

  async acceptSwapRequest(requestId) {
    return this.request(`/swaps/${requestId}/accept`, {
      method: 'PUT'
    });
  }

  async rejectSwapRequest(requestId) {
    return this.request(`/swaps/${requestId}/reject`, {
      method: 'PUT'
    });
  }

  async completeSwapRequest(requestId) {
    return this.request(`/swaps/${requestId}/complete`, {
      method: 'PUT'
    });
  }

  async cancelRequest(requestId) {
    return this.request(`/swaps/${requestId}/cancel`, {
      method: 'PUT'
    });
  }

  async completeSwap(requestId, ratingData) {
    return this.request(`/swaps/${requestId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(ratingData)
    });
  }

  async getSwapRequest(requestId) {
    return this.request(`/swaps/${requestId}`);
  }

  async submitFeedback(requestId, feedbackData) {
    return this.request(`/swaps/${requestId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 