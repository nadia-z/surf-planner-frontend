import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SurfPlanView from './SurfPlanView';
import { fetchSurfPlan } from '../api/surfPlanApi';

// Mock the fetchSurfPlan function
jest.mock('../api/surfPlanApi');

describe('SurfPlanView', () => {
  describe('removeStudent function', () => {
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
        }
      ],
      non_participating_guests: []
    };

    fetchSurfPlan.mockResolvedValue(mockData);
  });

  test('removeButton removes student from group when clicked', async () => {
    render(<SurfPlanView />);

    const studentButtons = await screen.findAllByRole('button', { name: /X/i });

    const maxsGroup = screen.getByRole('list', { name: /BEGINNER – 18 - 60/i });

    expect(maxsGroup).toHaveTextContent('Max Maler');
    expect(maxsGroup).toHaveTextContent('Lisa Maler');

    fireEvent.click(studentButtons[0]);

    await waitFor(() => {
      expect(maxsGroup).not.toHaveTextContent('Max Maler');
    });
    expect(maxsGroup).toHaveTextContent('Lisa Maler');
  });

  test('removes student from group when clicked and adds student to non-participating guests', async () => {
    render(<SurfPlanView />);

    const studentButtons = await screen.findAllByRole('button', { name: /X/i });

    const maxsGroup = screen.getByRole('list', { name: /BEGINNER – 18 - 60/i });

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

    const studentButtons = await screen.findAllByRole('button', { name: /X/i });

    const beginnerGroup = screen.getByRole('list', { name: /BEGINNER – 18 - 60/i });
    const intermediateGroup = screen.getByRole('list', { name: /BEGINNER – 18 - 60/i });

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
});
