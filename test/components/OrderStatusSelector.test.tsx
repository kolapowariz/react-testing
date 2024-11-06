import { cleanup, render, screen } from '@testing-library/react'
import { it, expect, describe, afterEach, vi } from 'vitest'
import OrderStatusSelector from '../../src/components/OrderStatusSelector'
import React from 'react'
import '@testing-library/jest-dom/vitest'
import { Theme } from '@radix-ui/themes'
import userEvent from '@testing-library/user-event'

afterEach(() => {
  cleanup()
})

describe('OrderStatusSelector', () => {
  it('should render New as the default value', () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    )

    const button = screen.getByRole('combobox')
    expect(button).toHaveTextContent(/new/i)
  });

  it('should render correct status', async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    )

    const button = screen.getByRole('combobox')
    const user = userEvent.setup()
    await user.click(button)

    const options = await screen.findAllByRole('option')
    expect(options).toHaveLength(3)
    const labels = options.map(option => option.textContent);
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled'])
    console.log(options[0].textContent)
  })
})