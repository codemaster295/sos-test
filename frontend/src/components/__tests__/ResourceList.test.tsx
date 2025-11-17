import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ResourceList } from '../ResourceList';
import { LocationProvider } from '../../contexts/LocationContext';
import { ambulanceApi } from '../../lib/api';
import { Ambulance } from '../../types';

jest.mock('../../lib/api');

const mockAmbulanceApi = ambulanceApi as jest.Mocked<typeof ambulanceApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>{children}</LocationProvider>
    </QueryClientProvider>
  );
};

describe('ResourceList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockAmbulanceApi.getAll.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves
        })
    );

    render(
      <ResourceList
        type="ambulances"
        page={1}
        onPageChange={jest.fn()}
        onEdit={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state', async () => {
    mockAmbulanceApi.getAll.mockRejectedValue(new Error('Network error'));

    render(
      <ResourceList
        type="ambulances"
        page={1}
        onPageChange={jest.fn()}
        onEdit={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading/i)).toBeInTheDocument();
    });
  });

  it('renders empty state', async () => {
    mockAmbulanceApi.getAll.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });

    render(
      <ResourceList
        type="ambulances"
        page={1}
        onPageChange={jest.fn()}
        onEdit={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText(/no ambulances found/i)).toBeInTheDocument();
    });
  });

  it('renders list of resources', async () => {
    const mockAmbulances: Ambulance[] = [
      {
        id: 1,
        title: 'Test Ambulance',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    ];

    mockAmbulanceApi.getAll.mockResolvedValue({
      data: mockAmbulances,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    render(
      <ResourceList
        type="ambulances"
        page={1}
        onPageChange={jest.fn()}
        onEdit={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Test Ambulance')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });
  });
});

