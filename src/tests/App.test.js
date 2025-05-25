import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import * as auth from '../utils/auth';
import api from '../utils/api';

// Mock all potential components imported by App.js
jest.mock('../components/Layout', () => () => <div>Mocked Layout</div>);
jest.mock('../components/Login', () => () => <div>Mocked Login</div>);
jest.mock('../components/Home', () => () => <div>Mocked Home</div>);
jest.mock('../pages/AddProductPage', () => () => <div>Mocked AddProductPage</div>);
jest.mock('../components/ProtectedRoute', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ProfileIcon', () => () => <div>Mocked ProfileIcon</div>); // Added for completeness
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
  Navigate: ({ to }) => <div data-navigate={to} />,
  useNavigate: () => jest.fn(),
}));
jest.mock('../utils/auth');
jest.mock('../utils/api');

describe('App Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('redirects root path to login when not authenticated', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    auth.getUserId.mockReturnValue(null);
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Mocked Login')).toBeInTheDocument();
  });

  test('redirects to home when authenticated', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    auth.getUserId.mockReturnValue('testuser');
    api.get.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Mocked Layout')).toBeInTheDocument();
  });

  test('handles invalid path', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    auth.getUserId.mockReturnValue(null);
    render(
      <MemoryRouter initialEntries={['/invalid']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Mocked Login')).toBeInTheDocument();
  });
});