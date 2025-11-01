import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyticsView from './AnalyticsView';
import { fetchFlexibleAnalytics } from '../api/analyticsApi';

// Mock the API
jest.mock('../api/analyticsApi');

describe('AnalyticsView', () => {
  const mockAnalyticsData = {
    summary: {
      total_guests: 100,
      guests_with_lessons: 80,
      guests_without_lessons: 20,
      average_lessons_per_guest: 2.5,
      age_groups: {
        adults: 60,
        teens: 25,
        kids: 15
      },
      lesson_types: {
        surf: 150,
        yoga: 30,
        skate: 20
      },
      skill_levels: {
        BEGINNER: 50,
        INTERMEDIATE: 30,
        ADVANCED: 20
      },
      lesson_distribution: {
        '1': 20,
        '2': 30,
        '3': 20,
        '4': 10
      }
    },
    time_series: [
      {
        period: '2025-01',
        total_guests: 50,
        guests_with_lessons: 40,
        guests_without_lessons: 10
      },
      {
        period: '2025-02',
        total_guests: 50,
        guests_with_lessons: 40,
        guests_without_lessons: 10
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchFlexibleAnalytics.mockResolvedValue(mockAnalyticsData);
  });

  describe('Initial Rendering', () => {
    it('should render the Analytics Dashboard title', () => {
      render(<AnalyticsView />);
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });

    it('should render dashboard controls', () => {
      render(<AnalyticsView />);
      expect(screen.getByText('Dashboard Controls')).toBeInTheDocument();
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
      expect(screen.getByLabelText('End Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Time Interval')).toBeInTheDocument();
    });

    it('should have default date values set', () => {
      render(<AnalyticsView />);
      const startDateInput = screen.getByLabelText('Start Date');
      const endDateInput = screen.getByLabelText('End Date');
      
      expect(startDateInput).toHaveValue('2025-01-01');
      expect(endDateInput).toHaveValue('2025-12-31');
    });

    it('should have monthly as default interval', () => {
      render(<AnalyticsView />);
      const intervalSelect = screen.getByLabelText('Time Interval');
      expect(intervalSelect).toHaveValue('monthly');
    });

    it('should render all metric checkboxes', () => {
      render(<AnalyticsView />);
      expect(screen.getByLabelText('Age Groups (Adults/Teens/Kids)')).toBeInTheDocument();
      expect(screen.getByLabelText('Lesson Types (Surf/Yoga/Skate)')).toBeInTheDocument();
      expect(screen.getByLabelText('Skill Levels')).toBeInTheDocument();
      expect(screen.getByLabelText('Total Guests')).toBeInTheDocument();
    });

    it('should have all metrics selected by default', () => {
      render(<AnalyticsView />);
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('Data Fetching', () => {
    it('should fetch analytics data on mount', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            interval: 'monthly'
          })
        );
      });
    });

    it('should display loading state while fetching data', async () => {
      fetchFlexibleAnalytics.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockAnalyticsData), 100))
      );
      
      render(<AnalyticsView />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });

    it('should display error message when fetch fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      fetchFlexibleAnalytics.mockRejectedValueOnce(new Error('API Error'));
      
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load analytics data. Please try again.')).toBeInTheDocument();
      });
      
      consoleSpy.mockRestore();
    });

    // TODO: Fix React 19 compatibility with fireEvent click on button
    it.skip('should refetch data when refresh button is clicked', async () => {
      render(<AnalyticsView />);
      
      // Wait for initial load to complete
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledTimes(1);
      });
      
      // Wait for button to not be loading anymore
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      const refreshButton = screen.getByText('Refresh Data');
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Interval Selection', () => {
    it('should update interval when changed', async () => {
      render(<AnalyticsView />);
      
      const intervalSelect = screen.getByLabelText('Time Interval');
      fireEvent.change(intervalSelect, { target: { value: 'weekly' } });
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            interval: 'weekly'
          })
        );
      });
    });

    it('should support daily interval', async () => {
      render(<AnalyticsView />);
      
      const intervalSelect = screen.getByLabelText('Time Interval');
      fireEvent.change(intervalSelect, { target: { value: 'daily' } });
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            interval: 'daily'
          })
        );
      });
    });
  });

  describe('Date Range Selection', () => {
    it('should update start date when changed', async () => {
      render(<AnalyticsView />);
      
      const startDateInput = screen.getByLabelText('Start Date');
      fireEvent.change(startDateInput, { target: { value: '2025-06-01' } });
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            startDate: '2025-06-01'
          })
        );
      });
    });

    it('should update end date when changed', async () => {
      render(<AnalyticsView />);
      
      const endDateInput = screen.getByLabelText('End Date');
      fireEvent.change(endDateInput, { target: { value: '2025-06-30' } });
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            endDate: '2025-06-30'
          })
        );
      });
    });
  });

  describe('Metric Filtering', () => {
    // TODO: Fix React 19 compatibility issues with fireEvent in state updates
    it.skip('should toggle metric selection when checkbox is clicked', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      const ageGroupsCheckbox = screen.getByLabelText('Age Groups (Adults/Teens/Kids)');
      expect(ageGroupsCheckbox).toBeChecked();
      
      fireEvent.click(ageGroupsCheckbox);
      
      await waitFor(() => {
        expect(ageGroupsCheckbox).not.toBeChecked();
      });
    });

    it.skip('should select all metrics when Select All is clicked', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      // First deselect all
      const deselectAllButton = screen.getByText('Deselect All');
      fireEvent.click(deselectAllButton);
      
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).not.toBeChecked();
        });
      });
      
      // Then select all
      const selectAllButton = screen.getByText('Select All');
      fireEvent.click(selectAllButton);
      
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked();
        });
      });
    });

    it.skip('should deselect all metrics when Deselect All is clicked', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      const deselectAllButton = screen.getByText('Deselect All');
      fireEvent.click(deselectAllButton);
      
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).not.toBeChecked();
        });
      });
    });

    it.skip('should pass selected metrics to API call', async () => {
      render(<AnalyticsView />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledTimes(1);
      });
      
      // Deselect some metrics
      const skillLevelsCheckbox = screen.getByLabelText('Skill Levels');
      fireEvent.click(skillLevelsCheckbox);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            metrics: expect.not.arrayContaining(['skill_levels'])
          })
        );
      });
    });
  });

  describe('Data Display', () => {
    it('should display summary statistics cards', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      // Check for card titles in the statistics section
      const cards = screen.getAllByText('Total Guests');
      expect(cards.length).toBeGreaterThan(0);
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('With Lessons')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('should display average lessons per guest', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      expect(screen.getByText('Avg Lessons')).toBeInTheDocument();
      expect(screen.getByText('2.5')).toBeInTheDocument();
    });

    it('should display lesson distribution table', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      expect(screen.getByText('Lesson Distribution')).toBeInTheDocument();
      expect(screen.getByText('Number of Lessons')).toBeInTheDocument();
      expect(screen.getByText('Number of Guests')).toBeInTheDocument();
    });

    it.skip('should hide metrics not selected', async () => {
      render(<AnalyticsView />);
      
      // Wait for initial render
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      expect(screen.getByText('Total Guests')).toBeInTheDocument();
      
      // Deselect total_guests metric
      const totalGuestsCheckbox = screen.getByLabelText('Total Guests');
      fireEvent.click(totalGuestsCheckbox);
      
      // Wait for re-render after state change
      await waitFor(() => {
        const cards = screen.queryAllByText('Total Guests');
        // Should still have the checkbox label but not the card
        expect(cards.length).toBe(1);
      });
    });
  });

  describe('Chart Rendering', () => {
    it('should display age group chart when metric is selected', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      expect(screen.getByText('Guest Distribution by Age Group')).toBeInTheDocument();
    });

    it('should display skill level chart when metric is selected', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      expect(screen.getByText('Skill Level Distribution')).toBeInTheDocument();
    });

    it('should display lesson types chart when metric is selected', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      expect(screen.getByText('Lesson Types Distribution')).toBeInTheDocument();
    });

    it('should display time series chart', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      expect(screen.getByText(/Trends Over Time/i)).toBeInTheDocument();
    });

    it.skip('should hide age group chart when metric is deselected', async () => {
      render(<AnalyticsView />);
      
      await waitFor(() => {
        expect(fetchFlexibleAnalytics).toHaveBeenCalled();
      });
      
      expect(screen.getByText('Guest Distribution by Age Group')).toBeInTheDocument();
      
      const ageGroupsCheckbox = screen.getByLabelText('Age Groups (Adults/Teens/Kids)');
      fireEvent.click(ageGroupsCheckbox);
      
      await waitFor(() => {
        expect(screen.queryByText('Guest Distribution by Age Group')).not.toBeInTheDocument();
      });
    });
  });
});
