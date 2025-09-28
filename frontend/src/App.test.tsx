import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main application logo', () => {
  render(<App />);
  const logoElement = screen.getByRole('link', { name: /BlogTech/i });
  
  expect(logoElement).toBeInTheDocument();
});