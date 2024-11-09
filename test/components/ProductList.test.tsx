import { render, screen } from '@testing-library/react'
import { it, expect, describe } from 'vitest'
import '@testing-library/jest-dom/vitest'
import ProductList from '../../src/components/ProductList'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

describe('ProductList', () => {
  it('shoould render the list of products', async () => {
    render(<ProductList />)
    const items = await screen.findAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
  })

  it('should render no products available if no product is found', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));

    render(<ProductList />);

    const message = await screen.findByText(/no products/i)
    expect(message).toBeInTheDocument()
  })
})