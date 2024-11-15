import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { it, expect, describe } from 'vitest'
import { server } from '../mocks/server'
import { delay, http, HttpResponse } from 'msw'
import BrowseProducts from '../../src/pages/BrowseProductsPage'
import { Theme } from '@radix-ui/themes'

describe('BrowseProductsPage', () => {

  const renderComponenet = () => {
    render(<Theme>
      <BrowseProducts />
    </Theme>)
  }

  it('should show a loading skeleton when fetching categories', () => {
    server.use(http.get('/categories', async () => {
      await delay()
      return HttpResponse.json([]);
    }))

    renderComponenet()

    expect(screen.getByRole('progressbar', { name: /categories/i })).toBeInTheDocument()
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    renderComponenet()

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /categories/i}))

  })

  it('should show a loading skeleton when fetching products', () => {
    server.use(http.get('/products', async () => {
      await delay()
      return HttpResponse.json([]);
    }))

    renderComponenet()

    expect(screen.getByRole('progressbar', { name: /products/i })).toBeInTheDocument()
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    renderComponenet()

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /products/i}))

  })

  it('should not render an error if categories cannot be fetched', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()))

    renderComponenet()

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /categories/i}))

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox', { name: /category/i})).not.toBeInTheDocument()
  })

  it('should render an error if products cannot be fetched', async () => {
    server.use(http.get('/products', () => HttpResponse.error()))

    renderComponenet()

    expect(await screen.findByText(/error/i)).toBeInTheDocument()
  })
})