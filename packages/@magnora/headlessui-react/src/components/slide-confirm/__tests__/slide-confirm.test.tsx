import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { SlideToConfirm } from '../slide-confirm'

describe('SlideToConfirm', () => {
  it('triggers confirm when interaction occurs', () => {
    const onConfirm = jest.fn()
    render(<SlideToConfirm threshold={0} onConfirm={onConfirm}>Confirm</SlideToConfirm>)

    const track = screen.getByRole('button')

    fireEvent.mouseDown(track, { clientX: 0 })
    fireEvent.mouseUp(track, { clientX: 0 })

    expect(onConfirm).toHaveBeenCalled()
    expect(track).toHaveAttribute('data-confirmed', 'true')
  })
})
