import { render, screen, fireEvent } from '@testing-library/react';
import Group from './group'; // Import the Group component

// Mocking non-participating guests data
const nonParticipatingGuests = [
  {
    student_id: "id-1",
    first_name: "Berthold",
    last_name: "Maler",
    age_group: "18 - 60",
    level: "BEGINNER",
    birthdate: "2000-01-01",
    gender: "M",
    start_date: "2025-05-05",
    end_date: "2025-05-12"
  },
  {
  first_name: "Anna",
  last_name: "Müller",
  birthdate: "2001-01-01",
  gender: "M",
  age_group: "18 - 60",
  level: "BEGINNER",
  student_id: "id-2",
  start_date: "2025-05-05",
  end_date: "2025-05-12",
  },
  {
    first_name: "Karl",
    last_name: "Doe",
    birthdate: "1999-06-01",
    gender: "M",
    age_group: "18 - 60",
    level: "BEGINNER",
    student_id: "id-3",
    start_date: "2025-05-05",
    end_date: "2025-05-12"
  }
];

const group = {
  level: 'Beginner',
  age_group: '18-30',
  students: [
    {
      student_id: "id-4",
      first_name: "Adam",
      last_name: "Malers",
      age_group: "18 - 60",
      level: "BEGINNER",
      birthdate: "2000-01-01",
      gender: "M",
      start_date: "2025-05-05",
      end_date: "2025-05-12"
    },
    {
      student_id: "id-5",
      first_name: "Ben",
      last_name: "Heinrich",
      age_group: "18 - 60",
      level: "BEGINNER",
      birthdate: "2000-01-01",
      gender: "M",
      start_date: "2025-05-05",
      end_date: "2025-05-12"
    },
    {
      student_id: "id-6",
      first_name: "Paul",
      last_name: "Malers",
      age_group: "18 - 60",
      level: "BEGINNER",
      birthdate: "2000-01-01",
      gender: "M",
      start_date: "2025-05-05",
      end_date: "2025-05-12"
    }
  ]
};

describe('Group Component', () => {
  describe('toggle non-participating guests function', () => {
    test('non-participating guest list is hidden initially', () => {
      render(<Group group={group} non_participating_guests={nonParticipatingGuests} />);
      expect(screen.queryByRole('list', { name: /non-participating guests/i })).not.toBeInTheDocument();
    });
    test('shows non-participating guests list when "Add students" button is clicked', async () => {
      render(<Group group={group} non_participating_guests={nonParticipatingGuests} />);

      expect(screen.queryByRole('list', { name: /non-participating guests/i })).not.toBeInTheDocument();

      const button = screen.getByRole('button', { name: /add students/i });
      fireEvent.click(button);

      const list = await screen.findByRole('list', { name: /non-participating guests/i });
      expect(list).toBeInTheDocument();

      // Check that the list contains the expected guests
      expect(screen.getByText('Berthold Maler')).toBeInTheDocument();
      expect(screen.getByText('Anna Müller')).toBeInTheDocument();
    });
  });
});
