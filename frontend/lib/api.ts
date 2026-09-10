const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ronito-app-production.up.railway.app'
  : 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'API request failed',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
    };
  }
}

export const api = {
  auth: {
    signup: (email: string, password: string) =>
      apiCall('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    getCurrentUser: () =>
      apiCall('/api/auth/me', { method: 'GET' }),
  },
  goals: {
    big: {
      get: () => apiCall('/api/goals/big', { method: 'GET' }),
      create: (goal: any) => apiCall('/api/goals/big', { method: 'POST', body: JSON.stringify(goal) }),
      update: (id: string, goal: any) => apiCall(`/api/goals/big/${id}`, { method: 'PUT', body: JSON.stringify(goal) }),
    },
    yearly: {
      list: () => apiCall('/api/goals/yearly', { method: 'GET' }),
      create: (goal: any) => apiCall('/api/goals/yearly', { method: 'POST', body: JSON.stringify(goal) }),
    },
    monthly: {
      list: () => apiCall('/api/goals/monthly', { method: 'GET' }),
      create: (goal: any) => apiCall('/api/goals/monthly', { method: 'POST', body: JSON.stringify(goal) }),
    },
    weekly: {
      list: () => apiCall('/api/goals/weekly', { method: 'GET' }),
      create: (goal: any) => apiCall('/api/goals/weekly', { method: 'POST', body: JSON.stringify(goal) }),
    },
    daily: {
      list: (date?: string) => apiCall(`/api/goals/daily${date ? `?goal_date=${date}` : ''}`, { method: 'GET' }),
      create: (goal: any) => apiCall('/api/goals/daily', { method: 'POST', body: JSON.stringify(goal) }),
      update: (id: string, updates: any) => apiCall(`/api/goals/daily/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
    },
  },
  timeBlocks: {
    list: () => apiCall('/api/time-blocks', { method: 'GET' }),
    create: (block: any) => apiCall('/api/time-blocks', { method: 'POST', body: JSON.stringify(block) }),
    update: (id: string, block: any) => apiCall(`/api/time-blocks/${id}`, { method: 'PUT', body: JSON.stringify(block) }),
    delete: (id: string) => apiCall(`/api/time-blocks/${id}`, { method: 'DELETE' }),
  },
  gratitude: {
    get: (date?: string) => apiCall(`/api/gratitude${date ? `?entry_date=${date}` : ''}`, { method: 'GET' }),
    create: (gratitude: any) => apiCall('/api/gratitude', { method: 'POST', body: JSON.stringify(gratitude) }),
    monthlyHistory: (month: string) => apiCall(`/api/gratitude/all/${month}`, { method: 'GET' }),
  },
  reflections: {
    get: (date?: string) => apiCall(`/api/reflections${date ? `?entry_date=${date}` : ''}`, { method: 'GET' }),
    create: (reflection: any) => apiCall('/api/reflections', { method: 'POST', body: JSON.stringify(reflection) }),
    monthlyStats: (month: string) => apiCall(`/api/reflections/stats/${month}`, { method: 'GET' }),
  },
  ideas: {
    folders: {
      list: () => apiCall('/api/ideas/folders', { method: 'GET' }),
      create: (folder: any) => apiCall('/api/ideas/folders', { method: 'POST', body: JSON.stringify(folder) }),
      delete: (id: string) => apiCall(`/api/ideas/folders/${id}`, { method: 'DELETE' }),
    },
    list: (folderId: string) => apiCall(`/api/ideas/${folderId}`, { method: 'GET' }),
    create: (idea: any) => apiCall('/api/ideas', { method: 'POST', body: JSON.stringify(idea) }),
    delete: (id: string) => apiCall(`/api/ideas/${id}`, { method: 'DELETE' }),
  },
  specialDates: {
    list: () => apiCall('/api/special-dates', { method: 'GET' }),
    create: (date: any) => apiCall('/api/special-dates', { method: 'POST', body: JSON.stringify(date) }),
    update: (id: string, date: any) => apiCall(`/api/special-dates/${id}`, { method: 'PUT', body: JSON.stringify(date) }),
    delete: (id: string) => apiCall(`/api/special-dates/${id}`, { method: 'DELETE' }),
  },
  health: {
    list: () => apiCall('/api/health', { method: 'GET' }),
    create: (session: any) => apiCall('/api/health', { method: 'POST', body: JSON.stringify(session) }),
    delete: (id: string) => apiCall(`/api/health/${id}`, { method: 'DELETE' }),
    library: () => apiCall('/api/health/library', { method: 'GET' }),
  },
  settings: {
    get: () => apiCall('/api/settings', { method: 'GET' }),
    update: (settings: any) => apiCall('/api/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  },
};
