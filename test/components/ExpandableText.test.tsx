import { cleanup, render, screen } from '@testing-library/react'
import { it, expect, describe, afterEach } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom/vitest'
import ExpandableText from '../../src/components/ExpandableText'
import userEvent from '@testing-library/user-event'

afterEach(() => {
  cleanup()
})

describe('TermsAndCondition', () => {
  const limit = 255;
  const longWord = 's'.repeat(limit + 1)
  const truncatedText = longWord.substring(0, 255) + '...'

  it('should show full text if it is less than 255', () => {

    const shortWord = 'Short word'
    render(<ExpandableText text={shortWord} />)

    expect(screen.getByText(shortWord)).toBeInTheDocument()
  })

  it('should truncate text if greater than 255', () => {

    render(<ExpandableText text={longWord} />)

    expect(screen.getByText(truncatedText)).toBeInTheDocument()
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(/more/i)
  });

  it('should expand text when show more button is clicked', async () => {

    render(<ExpandableText text={longWord} />)

    const button = screen.getByRole('button')
    const user = userEvent.setup();
    await user.click(button)

    expect(screen.getByText(longWord)).toBeInTheDocument()
    expect(button).toHaveTextContent(/less/i)
  })

  it('should collapse text when show less button is clicked', async () => {

    render(<ExpandableText text={longWord} />)
    const showMoreButton = screen.getByRole('button', {name: /more/i})
    const user = userEvent.setup();
    await user.click(showMoreButton)

    const showLessButton = screen.getByRole('button', { name: /less/i})
    await user.click(showLessButton);
    
    expect(screen.getByText(truncatedText)).toBeInTheDocument()
    expect(showMoreButton).toHaveTextContent(/more/i)
  })
})