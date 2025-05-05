import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SurfPlanView component', () => {
  render(<App />);
  const linkElement = screen.getByText(/Loading/i);
  expect(linkElement).toBeInTheDocument();
});
