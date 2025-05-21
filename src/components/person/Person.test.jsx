import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Person from './Person';

describe('Person Component', () => {
  it('renders name and level when provided', () => {
    render(<Person name="John Doe" level="BEGINNER" showButton={false} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('– Level BEGINNER')).toBeInTheDocument();
  });
  it('shows Button when set true', () => {
    render(<Person name="John Doe" level="BEGINNER" showButton={true} />);

    const removeButton = screen.getByRole("button");
    expect(removeButton).toHaveClass('remove-button');
    expect(removeButton).toBeInTheDocument();
  });
  it('does not render the remove button when showButton is false', () => {
    render(<Person name="John Doe" level="BEGINNER" showButton={false} />);

    const removeButton = screen.queryByRole('button', { name: /×/ });
    expect(removeButton).toBeNull();
  });

  it('does not render level if level is not provided', () => {
    render(<Person name="John Doe" showButton={false} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('– Level')).toBeNull();
  });
});
