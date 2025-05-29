import { render, screen, fireEvent } from '@testing-library/react';
import Group from './group'; // Import the Group component
import { waitFor } from '@testing-library/react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

const renderWithDnd = (ui) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {ui}
    </DndProvider>
  );
};

describe('Group Component', () => {
  test('renders Group component with given group props', () => {
    renderWithDnd(<Group group={group} non_participating_guests={nonParticipatingGuests} />);

    // Check if group heading renders
    expect(screen.getByText(/Beginner – 18-30/i)).toBeInTheDocument();

    // Check if all students in the group render
    expect(screen.getByText(/Adam Malers/)).toBeInTheDocument();
    expect(screen.getByText(/Ben Heinrich/)).toBeInTheDocument();
    expect(screen.getByText(/Paul Malers/)).toBeInTheDocument();
  });
  test('renders without non_participating_guests', () => {
    renderWithDnd(<Group group={group} />); // no non_participating_guests

    const button = screen.getByRole('button', { name: /add students/i });
    fireEvent.click(button);
    // Still renders the wrapper
    expect(screen.queryByRole('list', { name: /non-participating guests/i })).not.toBeInTheDocument(); // Assuming no guests to show
  });
  describe('Add Students list behavior', () => {
    test('is hidden by default', () => {
      renderWithDnd(<Group group={group} non_participating_guests={nonParticipatingGuests} />);
      expect(screen.queryByRole('list', { name: /non-participating guests/i })).not.toBeInTheDocument();
    });
    test('shows guest list when "Add students" is clicked', async () => {
      renderWithDnd(<Group group={group} non_participating_guests={nonParticipatingGuests} />);

      expect(screen.queryByRole('list', { name: /non-participating guests/i })).not.toBeInTheDocument();

      const button = screen.getByRole('button', { name: /add students/i });
      fireEvent.click(button);

      const list = await screen.findByRole('list', { name: /non-participating guests/i });
      expect(list).toBeInTheDocument();

      // Check that the list contains the expected guests
      expect(screen.getByText('Berthold Maler')).toBeInTheDocument();
      expect(screen.getByText('Anna Müller')).toBeInTheDocument();
    });
    test("closes guest list when clicking outside guest component", async () => {
      renderWithDnd(<Group group={group} non_participating_guests={nonParticipatingGuests} removeStudent={() => {}} />);

      const addButton = screen.getByRole("button", { name: "+ add students" });
      fireEvent.click(addButton);

      const guestList = await screen.findByRole("list", { name: /non-participating guests/i });
      expect(guestList).toBeInTheDocument();

      const outsideElement = document.createElement("div");
      document.body.appendChild(outsideElement);

      console.log("Attempting to click outside");

      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(screen.queryByRole("list", { name: /non-participating guests/i })).not.toBeInTheDocument();
      });

      document.body.removeChild(outsideElement);
    });

    test("does not close guest list when clicking inside the guest list", async () => {
      renderWithDnd(
        <Group
          group={group}
          non_participating_guests={nonParticipatingGuests}
          removeStudent={() => {}}
        />
      );

      const button = screen.getByRole("button", { name: /add students/i });
      fireEvent.click(button);

      const list = await screen.findByRole("list", {name: /non-participating guests/i,});

      fireEvent.mouseDown(list);

      await waitFor(() => {
        expect(screen.getByRole("list", {name: /non-participating guests/i,})).toBeInTheDocument();
      });
    });
  });
});
