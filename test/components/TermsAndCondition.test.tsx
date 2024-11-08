import { cleanup, render, screen } from '@testing-library/react'
import { it, expect, describe, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import TermsAndConditions from '../../src/components/TermsAndConditions'
import userEvent from '@testing-library/user-event'

afterEach(()=> {
  cleanup()
})

describe('TermsAndCondition', () => {

  const renderComponent = () => {
    render(<TermsAndConditions />)
    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button')
    }
  }
  it('should render the correct text and initial state', () => {
    const {heading, checkbox, button } = renderComponent()

    expect(heading).toHaveTextContent('Terms & Conditions')
    expect(checkbox).not.toBeChecked()
    expect(button).toBeDisabled()
  });

  it('should enable the button when the checkbox is checked', async () => {
    const {button, checkbox} = renderComponent()

    const user = userEvent.setup()
    await user.click(checkbox)

    expect(button).toBeEnabled();
    
  })
})