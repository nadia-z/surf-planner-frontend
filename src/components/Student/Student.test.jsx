import { render, screen, fireEvent } from '@testing-library/react';
import Student from './Student';

describe('Student component', () => {
  test('renders student full name', () => {
    const mockStudent = {
      student_id: 1,
      first_name: 'John',
      last_name: 'Doe'
    };

    render(<Student student={mockStudent} />);
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  test('calls removeStudent when button is clicked', () => {
    const mockRemove = jest.fn(); // mocks removeStudent function
    const mockStudent = {
      student_id: "id-123",
      first_name: "John",
      last_name: "Doe",
    };

    render(<Student student={mockStudent} removeStudent={mockRemove} />);

    const button = screen.getByRole("button", { name: "×" });
    fireEvent.click(button);

    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith("id-123");
  });
});
