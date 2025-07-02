/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Rating, RatingDisplay, Stars, Star, RatingCount } from '../rating'

describe('Rating Component', () => {
  describe('Interactive Rating', () => {
    it('renders with correct initial rating', () => {
      render(
        <Rating value={3} onChange={() => {}}>
          <Stars />
        </Rating>
      )
      
      const rating = screen.getByRole('slider')
      expect(rating).toHaveAttribute('aria-valuenow', '3')
      expect(rating).toHaveAttribute('aria-valuemin', '1')
      expect(rating).toHaveAttribute('aria-valuemax', '5')
    })

    it('handles rating changes', async () => {
      const user = userEvent.setup()
      const onChangeMock = jest.fn()
      
      render(
        <Rating value={0} onChange={onChangeMock}>
          <Stars />
        </Rating>
      )
      
      const starButtons = screen.getAllByRole('button')
      await user.click(starButtons[2]) // Click 3rd star (rating 3)
      
      expect(onChangeMock).toHaveBeenCalledWith(3)
    })

    it('supports custom max rating', () => {
      render(
        <Rating value={7} maxRating={10} onChange={() => {}}>
          <Stars />
        </Rating>
      )
      
      const rating = screen.getByRole('slider')
      expect(rating).toHaveAttribute('aria-valuemax', '10')
      
      const stars = screen.getAllByRole('button')
      expect(stars).toHaveLength(10)
    })

    it('supports React Aria interactions', () => {
      const onHoverMock = jest.fn()
      const onPressMock = jest.fn()
      
      render(
        <Rating value={2} onChange={() => {}} onHover={onHoverMock}>
          <Stars>
            {({ index, filled, halfFilled }) => (
              <Star 
                key={index} 
                index={index} 
                filled={filled} 
                halfFilled={halfFilled}
                onPress={onPressMock}
              >
                ★
              </Star>
            )}
          </Stars>
        </Rating>
      )
      
      const starButtons = screen.getAllByRole('button')
      expect(starButtons).toHaveLength(5)
      
      // Verify React Aria props are properly set up
      starButtons.forEach((button, index) => {
        expect(button).toHaveAttribute('aria-label', `Rate ${index + 1} stars`)
        expect(button).toHaveAttribute('data-filled', index < 2 ? 'true' : 'false')
      })
    })
  })

  describe('Display Rating', () => {
    it('renders as read-only', () => {
      render(
        <RatingDisplay value={4.5}>
          <Stars />
        </RatingDisplay>
      )
      
      const rating = screen.getByRole('img')
      expect(rating).toHaveAttribute('aria-label', 'Rating: 4.5 out of 5')
      
      // Should not have interactive buttons
      expect(screen.queryAllByRole('button')).toHaveLength(0)
    })

    it('displays total reviews in aria label', () => {
      render(
        <RatingDisplay value={4.2} totalReviews={123}>
          <Stars />
        </RatingDisplay>
      )
      
      const rating = screen.getByRole('img')
      expect(rating).toHaveAttribute('aria-label', 'Rating: 4.2 out of 5 (123 reviews)')
    })

    it('supports half-star precision', () => {
      render(
        <RatingDisplay value={3.5} precision="half">
          <Stars>
            {({ index, filled, halfFilled }) => (
              <Star key={index} index={index} filled={filled} halfFilled={halfFilled}>
                {filled ? '★' : halfFilled ? '☆' : '☆'}
              </Star>
            )}
          </Stars>
        </RatingDisplay>
      )
      
      const stars = screen.getAllByRole('presentation')
      expect(stars).toHaveLength(5)
    })
  })

  describe('Rating Count', () => {
    it('displays review count', () => {
      render(
        <RatingDisplay value={4}>
          <RatingCount totalReviews={42} />
        </RatingDisplay>
      )
      
      expect(screen.getByText('(42)')).toBeInTheDocument()
    })

    it('does not render when showCount is false', () => {
      render(
        <RatingDisplay value={4}>
          <RatingCount totalReviews={42} showCount={false} />
        </RatingDisplay>
      )
      
      expect(screen.queryByText('(42)')).not.toBeInTheDocument()
    })

    it('supports custom rendering', () => {
      render(
        <RatingDisplay value={4}>
          <RatingCount totalReviews={42}>
            {(count) => `${count} customer reviews`}
          </RatingCount>
        </RatingDisplay>
      )
      
      expect(screen.getByText('42 customer reviews')).toBeInTheDocument()
    })
  })
})
