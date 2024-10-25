import { api } from './api';

interface AuthState {
  token: string | null;
  user: any | null;
}

class AuthService {
  private state: AuthState = {
    token: localStorage.getItem('authToken'),
    user: null,
  };

  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor() {
    if (this.state.token) {
      this.loadUser().catch(() => this.logout());
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  async login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, user } = await response.json();
      localStorage.setItem('authToken', token);
      
      this.setState({ token, user });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('authToken');
    this.setState({ token: null, user: null });
  }

  private async loadUser() {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load user');
      }

      const user = await response.json();
      this.setState({ user });
    } catch (error) {
      console.error('Load user error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.state.token;
  }
}

export const authService = new AuthService();