import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer';

test('renders footer component', () => {
  const { getByText } = render(
    <Router>
        <Footer/>
    </Router>
  );
  const supportLink = getByText(/Support/i)
  expect(supportLink).toBeInTheDocument();
});
