import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { it, expect, describe, beforeAll, afterAll } from 'vitest'
import { server } from '../mocks/server'
import { delay, http, HttpResponse } from 'msw'
import BrowseProducts from '../../src/pages/BrowseProductsPage'
import { Theme } from '@radix-ui/themes'
import userEvent from '@testing-library/user-event'
import { Category, Product } from '../../src/entities'
import { db } from '../mocks/db'
import { CartProvider } from '../../src/providers/CartProvider'
import { simulateDelay, simulateError } from '../utils'

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = []

  beforeAll(() => {

    [1, 2].forEach((item) => {
      categories.push(db.category.create({ name: 'Category' + item}));
      products.push(db.product.create())
    })
  })

  afterAll(() => {
    const categoryIds = categories.map(c => c.id)
    db.category.deleteMany({ where: { id: { in: categoryIds } } })

    const productIds = products.map(p => p.id)
    db.product.deleteMany({ where: { id: { in: productIds } } })
  })

  const renderComponenet = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    )

    return{
      getProductSkeleton: () => screen.getByRole('progressbar', {name: /products/i}),
      getCategorySkeleton: () => screen.queryByRole('progressbar', { name: /categories/i }),
      getCategoriesComboBox: () => screen.queryByRole('combobox')
    }
  }

  it('should show a loading skeleton when fetching categories', () => {
    simulateDelay('/categories')

    const {getCategorySkeleton} = renderComponenet()

    expect(getCategorySkeleton()).toBeInTheDocument()
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    const {getCategorySkeleton} = renderComponenet()

    await waitForElementToBeRemoved(getCategorySkeleton)

  })

  it('should show a loading skeleton when fetching products', () => {
    simulateDelay('/products')

    const { getProductSkeleton } = renderComponenet()

    expect(getProductSkeleton()).toBeInTheDocument()
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    const { getProductSkeleton} = renderComponenet()

    await waitForElementToBeRemoved(getProductSkeleton)

  })

  it('should not render an error if categories cannot be fetched', async () => {
    simulateError('/categories')

    const {getCategorySkeleton, getCategoriesComboBox} = renderComponenet()

    await waitForElementToBeRemoved(getCategorySkeleton)

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    expect(getCategoriesComboBox()).not.toBeInTheDocument()
  })

  it('should render an error if products cannot be fetched', async () => {
    simulateError('/products')

    renderComponenet()

    expect(await screen.findByText(/error/i)).toBeInTheDocument()
  })

  it('should render categories', async () => {
    const {getCategorySkeleton, getCategoriesComboBox} = renderComponenet()

    
    await waitForElementToBeRemoved(getCategorySkeleton)
    
    const combobox = getCategoriesComboBox()
    expect(combobox).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(combobox!)

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument()
    categories.forEach(category => {
      expect((screen.getByRole('option', { name: category.name }))).toBeInTheDocument()
    })

  })

  it('should render products', async () => {
    const { getProductSkeleton } = renderComponenet()

    await waitForElementToBeRemoved(getProductSkeleton)
    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })
})