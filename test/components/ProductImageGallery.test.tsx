import { render, screen } from '@testing-library/react'
import { it, expect, describe } from 'vitest'
import '@testing-library/jest-dom/vitest'
import React from 'react'
import ProductImageGallery from '../../src/components/ProductImageGallery'

describe('ProductImageGallery', () => {
  it('should return nothing if given empty array', () => {
    const { container } = (render(<ProductImageGallery imageUrls={[]} />))
    expect(container).toBeEmptyDOMElement()
    screen.debug(container)    
  })

  it('should render list of images', () => {
    const imageUrls = ['url1', 'url2'];
    render(<ProductImageGallery imageUrls={imageUrls} />)
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url)
    })

  })
})