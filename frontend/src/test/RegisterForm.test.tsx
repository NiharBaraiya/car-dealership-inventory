import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';

const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockNavigate.mockReset();
  });

  it('submits registration details and navigates to home on success', async () => {
    mockRegister.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'New User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('newuser@example.com', 'password123', 'New User');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message on failed registration', async () => {
    mockRegister.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    });

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'New User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Email already exists')).toBeInTheDocument();
  });
});
