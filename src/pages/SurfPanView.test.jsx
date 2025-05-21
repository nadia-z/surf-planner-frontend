import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SurfPlanView from './SurfPlanView';
import { fetchSurfPlan } from '../api/surfPlanApi';

// Mock the fetchSurfPlan function
jest.mock('../api/surfPlanApi');

describe('SurfPlanView', () => {
  let mockData;

  beforeEach(() => {
    mockData = {
      surf_plan_id: 1,
      date: '2025-05-07',
      slots: [
        {
          time: '2025-05-07T12:00:00',
          groups: [
            {
              level: 'BEGINNER',
              age_group: '18 - 60',
              students: [
                { student_id: 'id-1', first_name: 'Max', last_name: 'Maler' },
                { student_id: 'id-2', first_name: 'Lisa', last_name: 'Maler' }
              ]
            },
            {
              level: 'INTERMEDIATE',
              age_group: '18 - 60',
              students: [
                { student_id: 'id-3', first_name: 'Tom', last_name: 'Maler' },
                { student_id: 'id-4', first_name: 'Jens', last_name: 'Maler' }
              ]
            }
          ]
        },
        {
          time: '2025-05-07T14:00:00',
          groups: [
            {
              level: 'BEGINNER',
              age_group: '18 - 60',
              students: [
                { student_id: 'id-11', first_name: 'Mia', last_name: 'Baler' },
                { student_id: 'id-12', first_name: 'Mimi', last_name: 'Raler' }
              ]
            },
            {
              level: 'INTERMEDIATE',
              age_group: '18 - 60',
              students: [
                { student_id: 'id-13', first_name: 'Moritz', last_name: 'Saler' },
                { student_id: 'id-14', first_name: 'Michael', last_name: 'Laler' }
              ]
            }
          ]
        }
      ],
      non_participating_guests: [{ student_id: 'id-5', first_name: 'Rahel', last_name: 'Heinrich' },
                                  { student_id: 'id-6', first_name: 'Kilian', last_name: 'Singer' },
                                  { student_id: 'id-7', first_name: 'Resi', last_name: 'Burger' },
                                  { student_id: 'id-8', first_name: 'Ben', last_name: 'Hirsch' }
      ]
    };

    fetchSurfPlan.mockResolvedValue(mockData);
  });
  test('handles fetch error and logs it', async () => {
    const mockError = new Error('Failed to fetch');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    fetchSurfPlan.mockRejectedValueOnce(mockError);

    render(<SurfPlanView />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    consoleSpy.mockRestore();
  });
  test('shows loading initially and hides after data loads', async () => {
    render(<SurfPlanView />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await screen.findAllByRole('list'); // wait for data
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
  describe('removeStudent function', () => {
    test('removeStudent adds removed student to non_participating_guests', async () => {
      render(<SurfPlanView />);

      const studentButtons = await screen.findAllByRole('button', { name: /×/i });

      const maxsGroup = screen.getByRole('list', { name: /BEGINNER – 18 - 60 – 0/i });

      expect(maxsGroup).toHaveTextContent('Max Maler');

      fireEvent.click(studentButtons[0]);

      const addStudentsbutton = await screen.findAllByRole('button', { name: /add students/i });
      fireEvent.click(addStudentsbutton[0]);

      const nonParticipatingGuests = screen.getByRole('list', { name: /non-participating guests/i });

      await waitFor(() => {
        expect(maxsGroup).not.toHaveTextContent('Max Maler');
      });
      expect(nonParticipatingGuests).toHaveTextContent('Max Maler');
    });

    test('removes multiple students one after another', async () => {
      render(<SurfPlanView />);

      const studentButtons = await screen.findAllByRole('button', { name: /×/i });

      const beginnerGroup = screen.getByRole('list', { name: /BEGINNER – 18 - 60 – 0/i });
      const intermediateGroup = screen.getByRole('list', { name: /INTERMEDIATE – 18 - 60 – 0/i });

      fireEvent.click(studentButtons[0]); // remove Max
      fireEvent.click(studentButtons[1]); // remove Lisa
      fireEvent.click(studentButtons[2]); // remove Tom
      fireEvent.click(studentButtons[3]); // remove Jens

      await waitFor(() => {
        expect(beginnerGroup).not.toHaveTextContent('Max Maler');
      });
        expect(beginnerGroup).not.toHaveTextContent('Lisa Maler');
        expect(intermediateGroup).not.toHaveTextContent('Tom Maler');
        expect(intermediateGroup).not.toHaveTextContent('Jens Maler');

        const addStudentsbutton = await screen.findAllByRole('button', { name: /add students/i });
        fireEvent.click(addStudentsbutton[0]);
        const guests = screen.getByRole('list', { name: /non-participating guests/i });
        expect(guests).toHaveTextContent('Max Maler');
        expect(guests).toHaveTextContent('Lisa Maler');
        expect(guests).toHaveTextContent('Tom Maler');
        expect(guests).toHaveTextContent('Jens Maler');
    });
    test('renders with no groups', async () => {
      mockData.slots[0].groups = [];
      fetchSurfPlan.mockResolvedValueOnce(mockData);

      render(<SurfPlanView />);

      // expect(await screen.findByText(/non-participating guests/i)).toBeInTheDocument();
      // expect no group list rendered
    });
  });
  describe('add Student to group logic', () => {
    test('addStudentToGroup adds guest to group and removes from guests', async () => {
      render(<SurfPlanView />);
      const addStudentsbutton = await screen.findAllByRole('button', { name: /add students/i });
      const beginnerGroup = await screen.findByRole('list', { name: /BEGINNER – 18 - 60 – 0/i });
      expect(beginnerGroup).not.toHaveTextContent('Rahel Heinrich');


      fireEvent.click(addStudentsbutton[0]);
      const guests = screen.getByRole('list', { name: /non-participating guests/i });
      expect(guests).toHaveTextContent('Rahel Heinrich');
      const guestItem = await screen.findByText('Rahel Heinrich');
      fireEvent.click(guestItem);

      expect(guests).not.toHaveTextContent('Rahel Heinrich');
      expect(beginnerGroup).toHaveTextContent('Rahel Heinrich');

    });
  });

});
