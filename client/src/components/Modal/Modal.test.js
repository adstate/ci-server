import React from 'react';
import { render } from '@testing-library/react';
import Modal from './Modal';


test('renders modal component', () => {
  const { getByText } = render(
    <Modal open>
        <div className="content">
            <div className="title">test modal</div>
        </div>
    </Modal>
  );
  expect(getByText(/test modal/i)).toBeInTheDocument();
});
