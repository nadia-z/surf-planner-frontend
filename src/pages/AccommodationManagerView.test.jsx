import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AccommodationManagerView from './AccommodationManagerView';
import {
  fetchAccommodations,
  fetchAccommodationAssignments,
  fetchCrewMembers
} from '../api/crewApi';

jest.mock('../api/crewApi');

describe('AccommodationManagerView', () => {
  const mockAccommodations = [
    { id: 1, name: 'Tent 1', type: 'Tent', capacity: 2 },
    { id: 2, name: 'Caravan 1', type: 'Caravan', capacity: 4 }
  ];

  const mockCrewMembers = [
    { id: 1, first_name: 'John', last_name: 'Doe', team_id: 1 },
    { id: 2, first_name: 'Jane', last_name: 'Smith', team_id: 2 }
  ];

  const mockAssignments = [
    {
      id: 1,
      crew_member_id: 1,
      accommodation_id: 1,
      start_date: '2025-04-01',
      end_date: '2025-04-15',
      notes: 'Early arrival'
    }
  ];

  beforeEach(() => {
    fetchAccommodations.mockResolvedValue(mockAccommodations);
    fetchCrewMembers.mockResolvedValue(mockCrewMembers);
    fetchAccommodationAssignments.mockResolvedValue(mockAssignments);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders accommodation manager view', async () => {
    render(<AccommodationManagerView />);
    
    expect(screen.getByText('Accommodation Manager')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(fetchAccommodations).toHaveBeenCalled();
      expect(fetchCrewMembers).toHaveBeenCalled();
      expect(fetchAccommodationAssignments).toHaveBeenCalled();
    });
  });

  test('displays date range inputs', () => {
    render(<AccommodationManagerView />);
    
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  test('displays new assignment button', () => {
    render(<AccommodationManagerView />);
    
    expect(screen.getByText('New Assignment')).toBeInTheDocument();
  });

  test('displays accommodation cards', async () => {
    render(<AccommodationManagerView />);
    
    await waitFor(() => {
      expect(screen.getByText('Tent 1')).toBeInTheDocument();
      expect(screen.getByText('Caravan 1')).toBeInTheDocument();
    });
  });

  test('displays loading state', () => {
    fetchAccommodations.mockImplementation(() => new Promise(() => {}));
    fetchCrewMembers.mockImplementation(() => new Promise(() => {}));
    fetchAccommodationAssignments.mockImplementation(() => new Promise(() => {}));
    
    render(<AccommodationManagerView />);
    
    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
  });

  test('displays error message on fetch failure', async () => {
    fetchAccommodations.mockRejectedValue(new Error('API Error'));
    fetchCrewMembers.mockRejectedValue(new Error('API Error'));
    fetchAccommodationAssignments.mockRejectedValue(new Error('API Error'));
    
    render(<AccommodationManagerView />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });
  });

  test('displays assignments for accommodations', async () => {
    render(<AccommodationManagerView />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('opens assignment modal when clicking new assignment button', async () => {
    render(<AccommodationManagerView />);
    
    await waitFor(() => {
      const newAssignmentButton = screen.getByText('New Assignment');
      fireEvent.click(newAssignmentButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('New Accommodation Assignment')).toBeInTheDocument();
    });
  });
});
