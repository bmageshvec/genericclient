import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileIcon from '../components/ProfileIcon';
import * as auth from '../utils/auth';

jest.mock('../utils/auth');

describe('ProfileIcon Component', () => {
  test('renders default initial when userId is not available', () => {
    auth.getUserId.mockReturnValue(null);
    render(
      <MemoryRouter>
        <ProfileIcon />
      </MemoryRouter>
    );
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  test('displays initial from userId', () => {
    auth.getUserId.mockReturnValue('john123');
    render(
      <MemoryRouter>
        <ProfileIcon />
      </MemoryRouter>
    );
    expect(screen.getByText('J')).toBeInTheDocument();
  });
});