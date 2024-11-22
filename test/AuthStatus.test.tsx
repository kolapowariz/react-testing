import { cleanup, render, screen } from '@testing-library/react'
import { it, expect, describe, beforeAll } from 'vitest'
import { mockAuthState } from './utils'
import AuthStatus from '../src/components/AuthStatus'

beforeAll(() => {
  cleanup()
})

describe('AuthStatus', () => {
  it('should render the loading message while fetching the auth status', () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: true,
      user: undefined
    });

    render(<AuthStatus />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should render the login button if user is not authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined
    });

    render(<AuthStatus />)

    expect(screen.getByRole('button', { name: /log in/i})).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /log out/i})).not.toBeInTheDocument()
  })

  it('should render the user name if authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: {name: 'Wariz'}
    });

    render(<AuthStatus />)

    expect(screen.getByText(/Wariz/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log out/i})).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /log in/i})).not.toBeInTheDocument()
  })
})