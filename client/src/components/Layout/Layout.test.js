import React from 'react';
import { render } from '@testing-library/react';
import Layout from './Layout';


test('renders layout component', () => {
  const { getByText } = render(
    <Layout align="center">
        <div>test</div>
    </Layout>
  );

  expect(getByText(/test/i)).toBeInTheDocument();
});
