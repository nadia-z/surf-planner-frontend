import axios from 'axios';
import { fetchFlexibleAnalytics } from './analyticsApi';

// Mock axios
jest.mock('axios');

describe('analyticsApi', () => {
  const mockData = {
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
        beginner: 50,
        intermediate: 30,
        advanced: 20
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
  });

  describe('fetchFlexibleAnalytics', () => {
    it('should fetch analytics data with default interval', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData });

      const options = {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      };

      const result = await fetchFlexibleAnalytics(options);

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/analytics/flexible'),
        expect.objectContaining({
          params: expect.objectContaining({
            start_date: '2025-01-01',
            end_date: '2025-12-31',
            interval: 'daily'
          })
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should fetch analytics data with monthly interval', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData });

      const options = {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        interval: 'monthly'
      };

      const result = await fetchFlexibleAnalytics(options);

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/analytics/flexible'),
        expect.objectContaining({
          params: expect.objectContaining({
            start_date: '2025-01-01',
            end_date: '2025-12-31',
            interval: 'monthly'
          })
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should fetch analytics data with weekly interval', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData });

      const options = {
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        interval: 'weekly'
      };

      const result = await fetchFlexibleAnalytics(options);

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/analytics/flexible'),
        expect.objectContaining({
          params: expect.objectContaining({
            interval: 'weekly'
          })
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should include metrics when provided', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData });

      const options = {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        interval: 'monthly',
        metrics: ['age_groups', 'skill_levels', 'total_guests']
      };

      await fetchFlexibleAnalytics(options);

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/analytics/flexible'),
        expect.objectContaining({
          params: expect.objectContaining({
            metrics: 'age_groups,skill_levels,total_guests'
          })
        })
      );
    });

    it('should not include metrics param when array is empty', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData });

      const options = {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        interval: 'daily',
        metrics: []
      };

      await fetchFlexibleAnalytics(options);

      const callParams = axios.get.mock.calls[0][1].params;
      expect(callParams.metrics).toBeUndefined();
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Network error');
      axios.get.mockRejectedValueOnce(mockError);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const options = {
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      };

      await expect(fetchFlexibleAnalytics(options)).rejects.toThrow('Network error');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch flexible analytics:', mockError);
      
      consoleSpy.mockRestore();
    });

    it('should use the correct API base URL from environment', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData });

      const options = {
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      };

      await fetchFlexibleAnalytics(options);

      // Check that it calls the URL with either the env var or default
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/\/analytics\/flexible$/),
        expect.any(Object)
      );
    });

    it('should handle response with missing optional fields', async () => {
      const minimalData = {
        summary: {
          total_guests: 50
        },
        time_series: []
      };
      
      axios.get.mockResolvedValueOnce({ data: minimalData });

      const options = {
        startDate: '2025-01-01',
        endDate: '2025-01-31'
      };

      const result = await fetchFlexibleAnalytics(options);
      expect(result).toEqual(minimalData);
    });
  });
});
