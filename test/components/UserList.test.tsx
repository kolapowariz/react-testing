import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import UserList from '../../src/components/UserList'
import { User } from '../../src/entities'

describe('UserList', () => {
  it('should not render user list when array is empty', () => {

    render(<UserList users={[]} />)

    expect(screen.getByText(/no user/i)).toBeInTheDocument()
  });

  it('should render list of user', () => {
    const users: User[] = [
      { id: 1, name: 'wariz' },
      { id: 2, name: 'Dimeji' }
    ]

    render(<UserList users={users} />)

    users.forEach(user => {
      const link = screen.getByRole('link', { name: user.name});
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`)
    })

  })
})