import { cleanup, render, screen} from '@testing-library/react'
import { it, expect, describe, afterEach } from 'vitest'
import ToastDemo from '../../src/components/ToastDemo'
import { Toaster } from 'react-hot-toast'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'


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