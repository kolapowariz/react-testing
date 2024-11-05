import { cleanup, render, screen} from '@testing-library/react'
import { it, expect, describe, afterEach, beforeAll, vi } from 'vitest'
import ToastDemo from '../../src/components/ToastDemo'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'


beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // For backward compatibility
      removeListener: vi.fn(), // For backward compatibility
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  });
})

afterEach(() => {
  cleanup()
})

describe('ToastDemo', () => {


  it('should show a toast', async () => {
    render(<>

      <ToastDemo />
      <Toaster />
    </>
    )

    const showToast = screen.getByRole('button', {name: /show/i});
    const user = userEvent.setup();
    await user.click(showToast)

    const toast = await screen.findByText(/success/i)
    expect(toast).toBeInTheDocument()
  })
})