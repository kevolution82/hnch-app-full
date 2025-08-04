// these tests check if deleting a message works in the user account
// mock the navigation so it doesn't actually change pages
// mock mygoons and confirmmodal so the tests are simpler

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import UserAccount from './UserAccount';

// UserAccount.test.jsx

// mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// mock MyGoons and ConfirmModal to avoid rendering their internals
jest.mock('./MyGoons', () => () => <div data-testid="mygoons" />);
jest.mock('./ConfirmModal', () => ({ message, onConfirm }) => (
  <div data-testid="modal">{message}<button onClick={onConfirm}>OK</button></div>
));

describe('useraccount handledelete', () => {
  const adminUser = { username: 'admin', role: 'ADMIN' };
  const userData = { id: 1, username: 'admin' };
  const chats = [
    {
      id: 'sal',
      name: 'Big Sal',
      messages: [
        { id: 101, sender: 'Big Sal', text: 'Hello' },
        { id: 102, sender: 'admin', text: 'Hi' },
      ],
    },
  ];

  beforeEach(() => {
    // put the admin user in localstorage
    window.localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
    window.localStorage.setItem('userProfile', JSON.stringify(adminUser));
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // clear localstorage and restore mocks after each test
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  function setup(tab = 'Messaging') {
    // set the messaging tab as active and render the component
    window.localStorage.setItem('accountActiveTab', tab);
    return render(
      <UserAccount userData={userData} chats={chats} myGoons={[]} />
    );
  }

it('removes the message from the screen when delete works', async () => {
  // mock fetch for loading messages
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 101, sender: 'Big Sal', text: 'Hello' },
        { id: 102, sender: 'admin', text: 'Hi' },
      ],
    })
    // mock fetch for delete
    .mockResolvedValueOnce({ ok: true });

  setup();

  // Wait for the message to appear
  await screen.findByText('Hello');

  // find and click the delete button
  const deleteButtons = await screen.findAllByText('Delete');
  expect(deleteButtons.length).toBeGreaterThan(0);

  fireEvent.click(deleteButtons[0]);

  // wait for the message to be gone from the screen
  await waitFor(() => {
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });
});

it('shows an error modal if there is a network error', async () => {
  // mock fetch for loading messages
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 101, sender: 'Big Sal', text: 'Hello' },
        { id: 102, sender: 'admin', text: 'Hi' },
      ],
    })
    // mock fetch for delete (this one throws)
    .mockRejectedValueOnce(new Error('Network error'));

  setup();

  // Wait for the message to appear
  await screen.findByText('Hello');

  const deleteButtons = await screen.findAllByText('Delete');
  fireEvent.click(deleteButtons[0]);

  // wait for the error modal to show up
  await waitFor(() => {
    expect(screen.getByTestId('modal')).toHaveTextContent('Failed to delete message');
  });
});
}
);