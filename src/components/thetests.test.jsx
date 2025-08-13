// this code is a jest test file for checking if deleting messages works in the user account screen
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import UserAccount from './UserAccount';

import { MemoryRouter } from 'react-router-dom';

// describe groups the tests together under a name
describe('useraccount handledelete', () => {

  // sets up fake data for testing
  // adminUser is a pretend user with admin rights
  const adminUser = { username: 'admin', role: 'ADMIN' };
  // userData is basic info about the user
  const userData = { id: 1, username: 'admin' };
  // chats is a list with one chat called "Big Sal" and two messages
  const chats = [
    {
      // id "sal" is used for chat, id "101" and "102" are used for messages
      id: 'sal',
      name: 'Big Sal',
      messages: [
        { id: 101, sender: 'Big Sal', text: 'Hello' },
        { id: 102, sender: 'admin', text: 'Hi' },
      ],
    },
  ];

  // beforeEach runs before every test
  // it puts the admin user info into localStorage so the app thinks an admin is logged in
  // it also sets up a fake fetch function so the app doesn't talk to the real backend
  beforeEach(() => {
    window.localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
    window.localStorage.setItem('userProfile', JSON.stringify(adminUser));
    global.fetch = jest.fn();
  });

  // afterEach runs after every test
  // it clears localStorage and resets any mocks so each test starts fresh
  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  // setup is a helper function that sets the messaging tab as active and shows the UserAccount screen with test data
  function setup(tab = 'Messaging') {
    window.localStorage.setItem('accountActiveTab', tab);
    return render(
      <MemoryRouter>
        <UserAccount userData={userData} chats={chats} myGoons={[]} />
      </MemoryRouter>
    );
  }

  // first test: checks if deleting a message removes it from the screen
  it('removes the message from the screen when delete works', async () => {
    // sets up fake fetch responses
    // first, fetch returns the two messages
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 101, sender: 'Big Sal', text: 'Hello' },
          { id: 102, sender: 'admin', text: 'Hi' },
        ],
      })
      // second, fetch returns ok for deleting the message
      .mockResolvedValueOnce({ ok: true });

    // shows the UserAccount screen
    setup();

    // waits for the message "Hello" to appear on the screen
    await screen.findByText('Hello');

    // finds all delete buttons and clicks the first one
    const deleteButtons = await screen.findAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // waits for the message "Hello" to be gone from the screen
    await waitFor(() => {
      expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    });
  });

  // second test: checks if an error modal shows up when there is a network error
  it('shows an error modal if there is a network error', async () => {
    // sets up fake fetch responses
    // first, fetch returns the two messages
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 101, sender: 'Big Sal', text: 'Hello' },
          { id: 102, sender: 'admin', text: 'Hi' },
        ],
      })
      // second, fetch throws an error when trying to delete
      .mockRejectedValueOnce(new Error('Network error'));

    // shows the UserAccount screen
    setup();

    // waits for the message "Hello" to appear on the screen
    await screen.findByText('Hello');

    // finds all delete buttons and clicks the first one
    const deleteButtons = await screen.findAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // waits for the error modal to show up with the message "Failed to delete message"
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toHaveTextContent('Failed to delete message');
    });
  });
});

// notes
// this test file uses jest and react testing library to check if deleting messages works
// fake data and fake fetch are used so the tests don't need a real backend or database
// beforeEach and afterEach make sure each test starts with a clean setup
// setup shows the UserAccount screen with test data
// the first test checks if a message disappears when deleted
// the second test checks if an error message appears when deleting fails
// these tests help make sure the app works correctly and handles errors in a more easier way