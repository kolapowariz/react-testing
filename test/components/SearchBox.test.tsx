import { cleanup, render, screen } from '@testing-library/react'
import { it, expect, describe, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import React from 'react'
import userEvent from '@testing-library/user-event'
import SearchBox from '../../src/components/SearchBox'

afterEach(()=> {
  cleanup()
})

describe('SearchBox', () => {

  const renderComponent = () => {
    const onChange = vi.fn()
    render(<SearchBox onChange={onChange} />)

    return{
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onChange
    }
  }
  it('should render an input field for searching', () => {
    const {input} = renderComponent()

    screen.debug()

    expect(input).toBeInTheDocument()
  });

  it('should call onchange when Enter key is pressed', async () => {
    const {onChange, input, user} = renderComponent();

    const searchTerm = 'SearchTerm'
    await user.type(input, searchTerm + '{enter}')
    
    expect(onChange).toHaveBeenCalledWith(searchTerm)
  });

  it('should not call onChange if input field is empty', async () => {
    const { input, onChange, user} = renderComponent()
    await user.type(input, '{enter}')

    expect(onChange).not.toHaveBeenCalled()    
  })
})