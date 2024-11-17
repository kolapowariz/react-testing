import { Theme } from '@radix-ui/themes'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Category, Product } from '../../src/entities'
import BrowseProducts from '../../src/pages/BrowseProductsPage'
import { CartProvider } from '../../src/providers/CartProvider'
import { db } from '../mocks/db'
import { simulateDelay, simulateError } from '../utils'

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = []

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create()
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id}))
      })
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

  it('should filter products by category', async () => {
    const {getCategoriesComboBox, getCategorySkeleton} = renderComponenet()

    await waitForElementToBeRemoved(getCategorySkeleton);
    const combobox = getCategoriesComboBox()
    const user = userEvent.setup()
    await user.click(combobox!)

    const selectedCategory = categories[0]
    const option = screen.getByRole('option', { name: selectedCategory.name})
    await user.click(option)

    const products = db.product.findMany({
      where: {
        categoryId: { equals: selectedCategory.id}
      }
    })
    const rows = screen.getAllByRole('row')
    const dataRows = rows.slice(1)
    expect(dataRows).toHaveLength(products.length)

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })

  it('should render all products if All category is selected', async () => {
    const {getCategoriesComboBox, getCategorySkeleton} = renderComponenet()

    await waitForElementToBeRemoved(getCategorySkeleton);
    const combobox = getCategoriesComboBox()
    const user = userEvent.setup()
    await user.click(combobox!)

    const option = screen.getByRole('option', { name: /all/i})
    await user.click(option)

    const products = db.product.getAll()
    const rows = screen.getAllByRole('row')
    const dataRows = rows.slice(1)
    expect(dataRows).toHaveLength(products.length)

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })
})