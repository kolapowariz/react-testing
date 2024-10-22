import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import UserAccount from '../../src/components/UserAccount'
import { User } from '../../src/entities'
import React from 'react'
import '@testing-library/jest-dom/vitest'

// test not working yesterday night cos it was rerendering solve by checking out the beforeeach or aftereach hook

describe('UserAccount', () => {
  it('should render user name', () => {
    const user: User = {
      id: 4,
      name: 'Wariz',
    }
    render(<UserAccount user={user} />)
    const result = screen.getByText(user.name)
    expect(result).toBeInTheDocument()
  });

  it('should not render edit button if user is not admin', () => {
    const user: User = {
      id: 4,
      name: 'Wariz',
      isAdmin: false
    }
    render(<UserAccount user={user} />)
    screen.debug()
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument()
  });

  it('should render edit button if user is an admin', () => {
    const user: User = {
      id: 4,
      name: 'Wariz',
      isAdmin: true
    }
    render(<UserAccount user={user} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i)
  });

  

  
})