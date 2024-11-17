import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Category, Product } from '../../src/entities'
import BrowseProducts from '../../src/pages/BrowseProductsPage'
import AllProviders from '../AllProvider'
import { db, getProductsByCategory } from '../mocks/db'
import { simulateDelay, simulateError } from '../utils'

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = []

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create()
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }))
      })
    })
  })

  afterAll(() => {
    const categoryIds = categories.map(c => c.id)
    db.category.deleteMany({ where: { id: { in: categoryIds } } })

    const productIds = products.map(p => p.id)
    db.product.deleteMany({ where: { id: { in: productIds } } })
  })

  it('should show a loading skeleton when fetching categories', () => {
    simulateDelay('/categories')

    const { getCategoriesSkeleton } = renderComponenet()

    expect(getCategoriesSkeleton()).toBeInTheDocument()
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    const { getCategoriesSkeleton } = renderComponenet()

    await waitForElementToBeRemoved(getCategoriesSkeleton)

  })

  it('should show a loading skeleton when fetching products', () => {
    simulateDelay('/products')

    const { getProductsSkeleton } = renderComponenet()

    expect(getProductsSkeleton()).toBeInTheDocument()
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    const { getProductsSkeleton } = renderComponenet()

    await waitForElementToBeRemoved(getProductsSkeleton)

  })

  it('should not render an error if categories cannot be fetched', async () => {
    simulateError('/categories')

    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponenet()

    await waitForElementToBeRemoved(getCategoriesSkeleton)

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    expect(getCategoriesComboBox()).not.toBeInTheDocument()
  })

  it('should render an error if products cannot be fetched', async () => {
    simulateError('/products')

    renderComponenet()

    expect(await screen.findByText(/error/i)).toBeInTheDocument()
  })

  it('should render categories', async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponenet()


    await waitForElementToBeRemoved(getCategoriesSkeleton)

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
    const { getProductsSkeleton } = renderComponenet()

    await waitForElementToBeRemoved(getProductsSkeleton)
    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })

  it('should filter products by category', async () => {
    const { selectCategory, expectProductsToBeInTheDocument } = renderComponenet()

    const selectedCategory = categories[0]
    await selectCategory(selectedCategory.name)

    const products = getProductsByCategory(selectedCategory.id)
    expectProductsToBeInTheDocument(products)
  })

  it('should render all products if All category is selected', async () => {
    const { selectCategory, expectProductsToBeInTheDocument } = renderComponenet()

    await selectCategory(/all/i)

    const products = db.product.getAll()
    expectProductsToBeInTheDocument(products)
  })
})


const renderComponenet = () => {
  render(<BrowseProducts />, { wrapper: AllProviders })

  const getCategoriesSkeleton = () => screen.queryByRole('progressbar', { name: /categories/i })

  const getProductsSkeleton = () => screen.getByRole('progressbar', { name: /products/i })

  const getCategoriesComboBox = () => screen.queryByRole('combobox');

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesComboBox()
    const user = userEvent.setup()
    await user.click(combobox!)

    const option = screen.getByRole('option', { name })
    await user.click(option)
  };

  const expectProductsToBeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole('row')
    const dataRows = rows.slice(1)
    expect(dataRows).toHaveLength(products.length)

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  }

  return {
    getProductsSkeleton,
    getCategoriesSkeleton,
    getCategoriesComboBox,
    selectCategory,
    expectProductsToBeInTheDocument
  }
}