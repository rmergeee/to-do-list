import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import axios from 'axios';

vi.mock('axios');

describe('App & Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders auth screen by default when no token', async () => {
    render(<App />);
    expect(await screen.findByText(/Intellectual Productivity/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /Увійти/i })).toBeInTheDocument();
  });

  it('renders dashboard when token exists', async () => {
    localStorage.setItem('token', 'fake.jwt.token');
    axios.get.mockResolvedValueOnce({ data: { user: { username: 'testuser', total_xp: 50, level: 1 }, tasks: [] } });
    
    render(<App />);
    
    // Assert dashboard
    expect(await screen.findByText(/testuser/i)).toBeInTheDocument();
    expect(await screen.findByText(/Рівень 1/i)).toBeInTheDocument();
  });
});
