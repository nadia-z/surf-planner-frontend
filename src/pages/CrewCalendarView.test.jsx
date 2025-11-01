import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CrewCalendarView from './CrewCalendarView';
import { fetchCrewCalendar, fetchTeams } from '../api/crewApi';

jest.mock('../api/crewApi');

describe('CrewCalendarView', () => {
  const mockTeams = [
    { id: 1, name: 'Team A', description: 'First team' },
    { id: 2, name: 'Team B', description: 'Second team' }
  ];

  const mockCalendarData = [
    {
      date: '2025-04-01',
      position_name: 'Surf Instructor',
      crew_member_name: 'John Doe',
      crew_member_id: 1
    },
    {
      date: '2025-04-02',
      position_name: 'Surf Instructor',
      crew_member_name: 'Jane Smith',
      crew_member_id: 2
    }
  ];

  beforeEach(() => {
    fetchTeams.mockResolvedValue(mockTeams);
    fetchCrewCalendar.mockResolvedValue(mockCalendarData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders crew calendar view', async () => {
    render(<CrewCalendarView />);
    
    expect(screen.getByText('Crew Calendar Overview')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(fetchTeams).toHaveBeenCalled();
      expect(fetchCrewCalendar).toHaveBeenCalled();
    });
  });

  test('displays date range inputs', () => {
    render(<CrewCalendarView />);
    
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  test('displays team filter dropdown', async () => {
    render(<CrewCalendarView />);
    
    await waitFor(() => {
      const teamFilter = screen.getByLabelText('Filter by Team');
      expect(teamFilter).toBeInTheDocument();
    });
  });

  test('displays loading state', () => {
    fetchTeams.mockImplementation(() => new Promise(() => {}));
    fetchCrewCalendar.mockImplementation(() => new Promise(() => {}));
    
    render(<CrewCalendarView />);
    
    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
  });

  test('displays error message on fetch failure', async () => {
    fetchTeams.mockResolvedValue(mockTeams);
    fetchCrewCalendar.mockRejectedValue(new Error('API Error'));
    
    render(<CrewCalendarView />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load calendar data')).toBeInTheDocument();
    });
  });
});
