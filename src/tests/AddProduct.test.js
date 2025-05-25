import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddProduct from '../components/AddProduct';
import api from '../utils/api';

jest.mock('../utils/api');

describe('AddProduct Component', () => {
  test('renders add product form with all fields', () => {
    render(
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Product Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Model')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Specifications')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
    expect(screen.getByTestId('image-upload')).toBeInTheDocument();
  });

  test('submits form with valid data including file', async () => {
    api.post.mockResolvedValue({});
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    render(
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    );
    await userEvent.type(screen.getByPlaceholderText('Product Name'), 'New Product');
    await userEvent.type(screen.getByPlaceholderText('Model'), 'Model X');
    await userEvent.type(screen.getByPlaceholderText('Specifications'), 'Spec details');
    await userEvent.upload(screen.getByTestId('image-upload'), file);
    fireEvent.click(screen.getByRole('button', { name: /add product/i }));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/products',
        expect.any(FormData),
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      );
      const formData = api.post.mock.calls[0][1];
      expect(formData.get('product')).toBe(JSON.stringify({
        name: 'New Product',
        model: 'Model X',
        spec: 'Spec details',
      }));
      expect(formData.get('image')).toBe(file);
    });
  });

  test('submits form without file', async () => {
    api.post.mockResolvedValue({});
    render(
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    );
    await userEvent.type(screen.getByPlaceholderText('Product Name'), 'New Product');
    await userEvent.type(screen.getByPlaceholderText('Model'), 'Model X');
    await userEvent.type(screen.getByPlaceholderText('Specifications'), 'Spec details');
    fireEvent.click(screen.getByRole('button', { name: /add product/i }));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/products',
        expect.any(FormData),
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      );
      const formData = api.post.mock.calls[0][1];
      expect(formData.get('product')).toBe(JSON.stringify({
        name: 'New Product',
        model: 'Model X',
        spec: 'Spec details',
      }));
      expect(formData.get('image')).toBeNull();
    });
  });

  test('displays error on invalid file type', async () => {
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    render(
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    );
    await userEvent.upload(screen.getByTestId('image-upload'), file);
    fireEvent.click(screen.getByRole('button', { name: /add product/i }));
    await waitFor(() => {
      expect(screen.getByText('Only JPEG or PNG images are allowed')).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  test('displays error on submission failure', async () => {
    api.post.mockRejectedValue(new Error('Failed to add product'));
    render(
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    );
    await userEvent.type(screen.getByPlaceholderText('Product Name'), 'New Product');
    await userEvent.type(screen.getByPlaceholderText('Model'), 'Model X');
    await userEvent.type(screen.getByPlaceholderText('Specifications'), 'Spec details');
    fireEvent.click(screen.getByRole('button', { name: /add product/i }));
    await waitFor(() => {
      expect(screen.getByText('Failed to add product')).toBeInTheDocument();
    });
  });
});