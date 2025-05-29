import { render, screen, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Student from "./Student";
import MockDropZone from "./mockDropZone";
import userEvent from "@testing-library/user-event";

const mockStudent = {
  student_id: "id-123",
  first_name: "John",
  last_name: "Doe",
};

const renderWithDnd = (ui) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {ui}
    </DndProvider>
  );
};

describe("Student component", () => {
  test("renders student full name", () => {
    renderWithDnd(<Student student={mockStudent} removeStudent={jest.fn()} />);
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  test("calls removeStudent when button is clicked", () => {
    const mockRemove = jest.fn();

    renderWithDnd(<Student student={mockStudent} removeStudent={mockRemove} />);

    const button = screen.getByRole("button", { name: "×" });
    fireEvent.click(button);

    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith("id-123");
  });
  test("student can be dragged and dropped into drop zone", async () => {
    const handleDrop = jest.fn();

    renderWithDnd(
      <>
        <Student student={mockStudent} removeStudent={jest.fn()} />
        <MockDropZone onDrop={handleDrop} />
      </>
    );

    // Find elements
    const studentEl = screen.getByRole("listitem", { name: /john doe student/i });
    const dropZone = screen.getByTestId("dropzone");

    // Simulate drag-and-drop (simple approach)
    fireEvent.dragStart(studentEl, {
      dataTransfer: {
        setData: () => {},
        getData: () => JSON.stringify({ student: mockStudent }),
      },
    });
    fireEvent.dragEnter(dropZone);
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone);
    fireEvent.dragEnd(studentEl);

    expect(handleDrop).toHaveBeenCalledTimes(1);
    expect(handleDrop).toHaveBeenCalledWith(mockStudent);
  });
});
