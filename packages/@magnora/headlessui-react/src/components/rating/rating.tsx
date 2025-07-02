'use client'

import React, { createContext, useContext } from 'react'
import { useHover, usePress } from '@react-aria/interactions'
import type { PressEvent, HoverEvent } from '@react-types/shared'

// Types for the rating system
export interface RatingValue {
  rating: number
  totalReviews: number
  maxRating?: number
}

export interface StarProps {
  filled: boolean
  halfFilled?: boolean
  index: number
  onPress?: (rating: number) => void
  onHoverStart?: (rating: number) => void
  onHoverEnd?: () => void
  children?: React.ReactNode
}

export interface RatingProps {
  value: number
  maxRating?: number
  onChange?: (rating: number) => void
  onHover?: (rating: number) => void
  onLeave?: () => void
  readonly?: boolean
  precision?: 'full' | 'half'
  children: React.ReactNode
}

export interface RatingDisplayProps {
  value: number
  totalReviews?: number
  maxRating?: number
  precision?: 'full' | 'half'
  children: React.ReactNode
}

// Context for sharing rating state
interface RatingContextValue {
  value: number
  maxRating: number
  hoveredValue: number | null
  readonly: boolean
  precision: 'full' | 'half'
  onChange?: (rating: number) => void
  onHover?: (rating: number) => void
  onLeave?: () => void
}

const RatingContext = createContext<RatingContextValue | null>(null)

// Hook to access rating context
export function useRating() {
  const context = useContext(RatingContext)
  if (!context) {
    throw new Error('Rating components must be used within a Rating component')
  }
  return context
}

// Interactive Rating Component (for input)
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ 
    value, 
    maxRating = 5, 
    onChange, 
    onHover,
    onLeave,
    readonly = false, 
    precision = 'full',
    children,
    ...props 
  }, ref) => {
    const [hoveredValue, setHoveredValue] = React.useState<number | null>(null)

    const handleStarHover = React.useCallback((rating: number) => {
      if (readonly) return
      setHoveredValue(rating)
      onHover?.(rating)
    }, [readonly, onHover])

    const handleMouseLeave = React.useCallback(() => {
      if (readonly) return
      setHoveredValue(null)
      onLeave?.()
    }, [readonly, onLeave])

    const contextValue: RatingContextValue = {
      value,
      maxRating,
      hoveredValue,
      readonly,
      precision,
      onChange,
      onHover: handleStarHover,
      onLeave: handleMouseLeave,
    }

    return (
      <RatingContext.Provider value={contextValue}>
        <div
          ref={ref}
          role={readonly ? 'img' : 'slider'}
          aria-label={readonly ? `Rating: ${value} out of ${maxRating}` : `Rate from 1 to ${maxRating}`}
          aria-valuenow={readonly ? undefined : value}
          aria-valuemin={readonly ? undefined : 1}
          aria-valuemax={readonly ? undefined : maxRating}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          {children}
        </div>
      </RatingContext.Provider>
    )
  }
)

Rating.displayName = 'Rating'

// Display-only Rating Component
export const RatingDisplay = React.forwardRef<HTMLDivElement, RatingDisplayProps>(
  ({ value, totalReviews, maxRating = 5, precision = 'half', children, ...props }, ref) => {
    const contextValue: RatingContextValue = {
      value,
      maxRating,
      hoveredValue: null,
      readonly: true,
      precision,
    }

    return (
      <RatingContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="img"
          aria-label={`Rating: ${value} out of ${maxRating}${totalReviews ? ` (${totalReviews} reviews)` : ''}`}
          {...props}
        >
          {children}
        </div>
      </RatingContext.Provider>
    )
  }
)

RatingDisplay.displayName = 'RatingDisplay'

// Individual Star Component
export const Star = React.forwardRef<HTMLButtonElement, StarProps>(
  ({ filled, halfFilled = false, index, onPress, onHoverStart, onHoverEnd, children, ...props }, ref) => {
    const context = useRating()
    const { readonly, onChange, onHover: contextOnHover, onLeave: contextOnLeave } = context

    const handlePress = React.useCallback(() => {
      if (readonly) return
      const rating = index + 1
      onChange?.(rating)
      onPress?.(rating)
    }, [readonly, index, onChange, onPress])

    const handleHoverStart = React.useCallback(() => {
      if (readonly) return
      const rating = index + 1
      contextOnHover?.(rating)
      onHoverStart?.(rating)
    }, [readonly, index, contextOnHover, onHoverStart])

    const handleHoverEnd = React.useCallback(() => {
      if (readonly) return
      contextOnLeave?.()
      onHoverEnd?.()
    }, [readonly, contextOnLeave, onHoverEnd])

    const { value: ctxValue, hoveredValue, precision } = context
    const currentValue = hoveredValue ?? ctxValue
    const starValue = index + 1

    let fillPercentage = 0

    if (currentValue >= starValue) fillPercentage = 100
    else if (currentValue > index) {
      if (precision === 'half') {
        const remainder = currentValue - index
        fillPercentage = remainder >= 0.5 ? 50 : 0
      } else {
        fillPercentage = Math.round((currentValue - index) * 100)
      }
    }

    // React Aria hooks for better interaction handling
    const { hoverProps } = useHover({
      isDisabled: readonly,
      onHoverStart: handleHoverStart,
      onHoverEnd: handleHoverEnd,
    })

    const { pressProps } = usePress({
      isDisabled: readonly,
      onPress: handlePress,
    })

    if (readonly) {
      return (
        <span
          role="presentation"
          data-filled={fillPercentage > 0}
          data-fill-percentage={fillPercentage}
          {...props}
        >
          {children}
        </span>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        data-filled={fillPercentage > 0}
        data-fill-percentage={fillPercentage}
        aria-label={`Rate ${index + 1} stars`}
        {...hoverProps}
        {...pressProps}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Star.displayName = 'Star'

// Stars Group Component
export interface StarsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: (star: { index: number; filled: boolean; halfFilled: boolean }) => React.ReactNode
}

export const Stars = React.forwardRef<HTMLDivElement, StarsProps>(
  ({ children, ...props }, ref) => {
    const { value, maxRating, hoveredValue, precision } = useRating()
    const currentValue = hoveredValue ?? value

    return (
      <div ref={ref} {...props}>
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1
          const filled = currentValue >= starValue
          const halfFilled = precision === 'half' && 
            currentValue >= index + 0.5 && 
            currentValue < starValue

          if (children) {
            return children({ index, filled, halfFilled })
          }

          return (
            <Star key={index} index={index} filled={filled} halfFilled={halfFilled}>
              ★
            </Star>
          )
        })}
      </div>
    )
  }
)

Stars.displayName = 'Stars'

// Count/Reviews Text Component
export interface RatingCountProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  totalReviews?: number
  showCount?: boolean
  children?: (count: number) => React.ReactNode
}

export const RatingCount = React.forwardRef<HTMLSpanElement, RatingCountProps>(
  ({ totalReviews, showCount = true, children, ...props }, ref) => {
    if (!showCount || !totalReviews) return null

    return (
      <span ref={ref} {...props}>
        {children ? children(totalReviews) : `(${totalReviews})`}
      </span>
    )
  }
)

RatingCount.displayName = 'RatingCount'