import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import LogIn from './logIn';

jest.mock('axios');

describe('LogIn component', () => {
  test('renders LogIn component', () => {
    render(<LogIn />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Iniciar Sesión');

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('handles form submission successfully', async () => {
    const mockResponse = {
      data: {
        token: 'mockToken',
        image_path: 'mockImagePath',
        username: 'mockUsername',
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(<LogIn />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Iniciar Sesión');

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(LOGIN_URL, {
        username: 'testUser',
        password: 'testPassword',
      });
      expect(document.cookie).toContain('isAuthenticated=true');
      expect(document.cookie).toContain('auth_token=mockToken');
      expect(document.cookie).toContain('avatar=mockImagePath');
      expect(document.cookie).toContain('username=mockUsername');
      expect(toast.success).toHaveBeenCalledWith('Sesion iniciada correctamente');
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles form submission with error', async () => {
    const mockError = {
      response: {
        data: {
          error: 'mockError',
        },
      },
    };
    axios.post.mockRejectedValueOnce(mockError);

    render(<LogIn />);
    const submitButton = screen.getByText('Iniciar Sesión');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith('Error al realizar la solicitud:mockError');
    });
  });
});