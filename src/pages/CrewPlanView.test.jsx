import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CrewPlanView from './CrewPlanView';
import {
  fetchCrewAssignments,
  fetchTeams,
  fetchCrewMembers
} from '../api/crewApi';

jest.mock('../api/crewApi');

describe('CrewPlanView', () => {
  const mockTeams = [
    { id: 1, name: 'Team A', description: 'First team' },
    { id: 2, name: 'Team B', description: 'Second team' }
  ];

  const mockCrewMembers = [
    { id: 1, first_name: 'John', last_name: 'Doe', team_id: 1 },
    { id: 2, first_name: 'Jane', last_name: 'Smith', team_id: 2 }
  ];

  const mockAssignments = [
    {
      id: 1,
      crew_member_id: 1,
      position_name: 'Surf Instructor',
      start_date: '2025-04-01',
      end_date: '2025-04-30',
      notes: 'Morning shifts'
    },
    {
      id: 2,
      crew_member_id: 2,
      position_name: 'Camp Manager',
      start_date: '2025-05-01',
      end_date: '2025-05-31',
      notes: ''
    }
  ];

  beforeEach(() => {
    fetchTeams.mockResolvedValue(mockTeams);
    fetchCrewMembers.mockResolvedValue(mockCrewMembers);
    fetchCrewAssignments.mockResolvedValue(mockAssignments);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders crew plan view', async () => {
    render(<CrewPlanView />);
    
    expect(screen.getByText('Crew Plan Overview')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(fetchTeams).toHaveBeenCalled();
      expect(fetchCrewMembers).toHaveBeenCalled();
      expect(fetchCrewAssignments).toHaveBeenCalled();
    });
  });

  test('displays date range inputs', () => {
    render(<CrewPlanView />);
    
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  test('displays team filter dropdown', async () => {
    render(<CrewPlanView />);
    
    await waitFor(() => {
      const teamFilter = screen.getByLabelText('Filter by Team');
      expect(teamFilter).toBeInTheDocument();
    });
  });

  test('displays loading state', () => {
    fetchTeams.mockImplementation(() => new Promise(() => {}));
    fetchCrewMembers.mockImplementation(() => new Promise(() => {}));
    fetchCrewAssignments.mockImplementation(() => new Promise(() => {}));
    
    render(<CrewPlanView />);
    
    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
  });

  test('displays error message on fetch failure', async () => {
    fetchTeams.mockResolvedValue(mockTeams);
    fetchCrewMembers.mockResolvedValue(mockCrewMembers);
    fetchCrewAssignments.mockRejectedValue(new Error('API Error'));
    
    render(<CrewPlanView />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load crew assignments')).toBeInTheDocument();
    });
  });

  test('displays crew member cards with assignments', async () => {
    render(<CrewPlanView />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Surf Instructor')).toBeInTheDocument();
      expect(screen.getByText('Camp Manager')).toBeInTheDocument();
    });
  });
});
