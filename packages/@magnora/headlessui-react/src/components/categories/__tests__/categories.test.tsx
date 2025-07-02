import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { CategoriesProvider } from '../categories'

describe('Categories', () => {
  it('renders and selects category', async () => {
    const onCategoryChange = jest.fn()
    const user = userEvent.setup()

    render(
      <CategoriesProvider
        categories={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}
        onCategoryChange={onCategoryChange}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    await user.click(buttons[1])
    expect(onCategoryChange).toHaveBeenCalledWith('b')
    expect(buttons[1]).toHaveAttribute('data-selected', 'true')
  })
})
