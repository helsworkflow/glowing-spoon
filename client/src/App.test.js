import { render, screen } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url === '/api/values/current') return Promise.resolve({ data: {} });
    if (url === '/api/values/all') return Promise.resolve({ data: [] });
    return Promise.resolve({ data: {} });
  });
  axios.post.mockResolvedValue({});
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
