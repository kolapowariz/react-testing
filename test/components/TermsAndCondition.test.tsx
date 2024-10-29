import { cleanup, render, screen } from '@testing-library/react'
import { it, expect, describe, afterEach } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom/vitest'
import TermsAndConditions from '../../src/components/TermsAndConditions'
import userEvent from '@testing-library/user-event'

afterEach(()=> {
  cleanup()
})

describe('TermsAndCondition', () => {
  it('should render the correct text and initial state', () => {
    render(<TermsAndConditions />)

    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Terms & Conditions')

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked()

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  });

  it('should enable the button when the checkbox is checked', async () => {
    render(<TermsAndConditions />)

    const checkbox = screen.getByRole('checkbox')
    const user = userEvent.setup()
    await user.click(checkbox)

    screen.debug()
    expect(screen.getByRole('button')).toBeEnabled();
    
  })
})