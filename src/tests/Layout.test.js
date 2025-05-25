import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../components/Layout';

jest.mock('../components/ProfileIcon', () => () => <span>ProfileIcon</span>);
jest.mock('../utils/auth', () => ({
  logout: jest.fn(),
}));

describe('Layout Component', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('highlights active link in sidebar for Home route', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Layout />
      </MemoryRouter>
    );
    const homeLink = screen.getByText('Home');
    const addProductLink = screen.getByText('Add Product');
    expect(homeLink).toHaveClass('active');
    expect(addProductLink).not.toHaveClass('active');
  });

  test('highlights active link in sidebar for Add Product route', () => {
    render(
      <MemoryRouter initialEntries={['/add-product']}>
        <Layout />
      </MemoryRouter>
    );
    const homeLink = screen.getByText('Home');
    const addProductLink = screen.getByText('Add Product');
    expect(homeLink).not.toHaveClass('active');
    expect(addProductLink).toHaveClass('active');
  });
});