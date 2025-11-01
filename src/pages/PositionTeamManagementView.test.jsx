import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PositionTeamManagementView from './PositionTeamManagementView';
import {
  fetchPositions,
  fetchTeams,
  createPosition,
  createTeam
} from '../api/crewApi';

jest.mock('../api/crewApi');

describe('PositionTeamManagementView', () => {
  const mockPositions = [
    { id: 1, name: 'Surf Instructor', description: 'Teaching surfing', team_id: 1 },
    { id: 2, name: 'Camp Manager', description: 'Managing camp', team_id: 2 }
  ];

  const mockTeams = [
    { id: 1, name: 'Teaching Team', description: 'All instructors' },
    { id: 2, name: 'Management Team', description: 'Camp management' }
  ];

  beforeEach(() => {
    fetchPositions.mockResolvedValue(mockPositions);
    fetchTeams.mockResolvedValue(mockTeams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders position and team management view', async () => {
    render(<PositionTeamManagementView />);
    
    expect(screen.getByText('Position & Team Management')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(fetchPositions).toHaveBeenCalled();
      expect(fetchTeams).toHaveBeenCalled();
    });
  });

  test('displays positions tab by default', async () => {
    render(<PositionTeamManagementView />);
    
    await waitFor(() => {
      expect(screen.getByText('Positions List')).toBeInTheDocument();
      expect(screen.getByText('Add Position')).toBeInTheDocument();
    });
  });

  test('switches to teams tab', async () => {
    render(<PositionTeamManagementView />);
    
    const teamsTab = screen.getByRole('button', { name: /teams/i });
    fireEvent.click(teamsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Teams List')).toBeInTheDocument();
      expect(screen.getByText('Add Team')).toBeInTheDocument();
    });
  });

  test('displays positions list', async () => {
    render(<PositionTeamManagementView />);
    
    await waitFor(() => {
      expect(screen.getByText('Surf Instructor')).toBeInTheDocument();
      expect(screen.getByText('Camp Manager')).toBeInTheDocument();
    });
  });

  test('displays teams list', async () => {
    render(<PositionTeamManagementView />);
    
    const teamsTab = screen.getByRole('button', { name: /teams/i });
    fireEvent.click(teamsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Teaching Team')).toBeInTheDocument();
      expect(screen.getByText('Management Team')).toBeInTheDocument();
    });
  });

  test('displays loading state', () => {
    fetchPositions.mockImplementation(() => new Promise(() => {}));
    fetchTeams.mockImplementation(() => new Promise(() => {}));
    
    render(<PositionTeamManagementView />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    fetchPositions.mockRejectedValue(new Error('API Error'));
    fetchTeams.mockRejectedValue(new Error('API Error'));
    
    render(<PositionTeamManagementView />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });
  });
});
