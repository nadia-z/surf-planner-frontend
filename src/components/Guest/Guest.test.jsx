import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Guest from './Guest';

describe('Guest Component', () => {
  it("renders Guest first and last name", () => {
      const mockGuest = {
      student_id: 1,
      first_name: 'Paul',
      last_name: 'Maler'
    };
    render(<Guest student={mockGuest}/>);
    expect(screen.getByText(/Paul/i)).toBeInTheDocument();
  });
    it('calls onClick with student_id when clicked', () => {
      const handleClick = jest.fn(); // mocks addStudentToGroup function

      const mockGuest = {
      student_id: "id-123",
      first_name: 'Paul',
      last_name: 'Maler'
    };
    render(<Guest student={mockGuest} onClick={handleClick}/>);

    fireEvent.click(screen.getByText(/Paul Maler/i));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith("id-123");  });
});
