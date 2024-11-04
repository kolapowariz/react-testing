import { it, expect, describe, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
// import { waitFor } from '@testing-library/react'
import React from 'react'
import "@testing-library/jest-dom/vitest"
import TagList from '../../src/components/TagList'

afterEach(() => {
  cleanup()
});

describe('TagList', () => {
  it('should render tags', async () => {

    render(<TagList />)

    // await waitFor(()=> {

    //   screen.debug()
    //   const listItems = screen.getAllByRole('listitem')
    //   expect(listItems.length).toBeGreaterThan(0)
    // });

    const listItems = await screen.findAllByRole('listitem')
    screen.debug()
    expect(listItems.length).toBeGreaterThan(0)

  })
})