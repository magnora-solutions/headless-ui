'use client'

import React, { createContext, useContext } from 'react'

// Types for review system
export interface ReviewData {
  id: string
  rating: number
  title?: string
  content: string
  author: {
    name: string
    verified?: boolean
    avatar?: string
  }
  date: Date
  helpful?: number
  media?: {
    type: 'image' | 'video'
    url: string
    alt?: string
  }[]
  verified?: boolean
  productId?: string
}

export interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  review: ReviewData
  children: React.ReactNode
}

export interface ReviewAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  children?: React.ReactNode
}

export interface ReviewContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface ReviewMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface ReviewActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface ReviewMediaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: (media: ReviewData['media']) => React.ReactNode
}

// Context for sharing review data
interface ReviewContextValue {
  review: ReviewData
}

const ReviewContext = createContext<ReviewContextValue | null>(null)

// Hook to access review context
export function useReview() {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('Review components must be used within a Review component')
  }
  return context
}

// Main Review Component
export const Review = React.forwardRef<HTMLDivElement, ReviewProps>(
  ({ review, children, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({
      review,
    }), [review])

    return (
      <ReviewContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-review-id={review.id}
          data-rating={review.rating}
          data-verified={review.verified}
          role="article"
          aria-label={`Review by ${review.author.name}`}
          {...props}
        >
          {children}
        </div>
      </ReviewContext.Provider>
    )
  }
)

Review.displayName = 'Review'

// Author Avatar Component
export const ReviewAvatar = React.forwardRef<HTMLDivElement, ReviewAvatarProps>(
  ({ src, alt, children, ...props }, ref) => {
    const { review } = useReview()
    const avatarSrc = src ?? review.author.avatar
    const avatarAlt = alt ?? `${review.author.name} avatar`

    return (
      <div ref={ref} data-slot="avatar" {...props}>
        {children ? (
          children
        ) : avatarSrc ? (
          <img src={avatarSrc} alt={avatarAlt} />
        ) : (
          <span aria-label={avatarAlt}>
            {review.author.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    )
  }
)

ReviewAvatar.displayName = 'ReviewAvatar'

// Author Name Component
export const ReviewAuthor = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, ...props }, ref) => {
    const { review } = useReview()

    return (
      <span
        ref={ref}
        data-slot="author"
        data-verified={review.author.verified}
        {...props}
      >
        {children ?? review.author.name}
      </span>
    )
  }
)

ReviewAuthor.displayName = 'ReviewAuthor'

// Review Title Component
export const ReviewTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, ...props }, ref) => {
    const { review } = useReview()

    if (!review.title && !children) return null

    return (
      <h3 ref={ref} data-slot="title" {...props}>
        {children ?? review.title}
      </h3>
    )
  }
)

ReviewTitle.displayName = 'ReviewTitle'

// Review Content Component
export const ReviewContent = React.forwardRef<HTMLDivElement, ReviewContentProps>(
  ({ children, ...props }, ref) => {
    const { review } = useReview()

    return (
      <div ref={ref} data-slot="content" {...props}>
        {children ?? review.content}
      </div>
    )
  }
)

ReviewContent.displayName = 'ReviewContent'

// Review Date Component
export const ReviewDate = React.forwardRef<HTMLTimeElement, React.HTMLAttributes<HTMLTimeElement> & {
  format?: (date: Date) => string
}>(
  ({ children, format, ...props }, ref) => {
    const { review } = useReview()
    const formattedDate = format ? format(review.date) : review.date.toLocaleDateString()

    return (
      <time
        ref={ref}
        data-slot="date"
        dateTime={review.date.toISOString()}
        {...props}
      >
        {children ?? formattedDate}
      </time>
    )
  }
)

ReviewDate.displayName = 'ReviewDate'

// Review Rating Component (integrates with rating system)
export const ReviewRating = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    const { review } = useReview()

    return (
      <div
        ref={ref}
        data-slot="rating"
        data-rating={review.rating}
        role="img"
        aria-label={`Rating: ${review.rating} out of 5 stars`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ReviewRating.displayName = 'ReviewRating'

// Review Meta Information Component
export const ReviewMeta = React.forwardRef<HTMLDivElement, ReviewMetaProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="meta" {...props}>
        {children}
      </div>
    )
  }
)

ReviewMeta.displayName = 'ReviewMeta'

// Review Actions Component (helpful, share, etc.)
export const ReviewActions = React.forwardRef<HTMLDivElement, ReviewActionsProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="actions" role="group" aria-label="Review actions" {...props}>
        {children}
      </div>
    )
  }
)

ReviewActions.displayName = 'ReviewActions'

// Review Media Component
export const ReviewMedia = React.forwardRef<HTMLDivElement, ReviewMediaProps>(
  ({ children, ...props }, ref) => {
    const { review } = useReview()

    if (!review.media?.length) return null

    return (
      <div ref={ref} data-slot="media" {...props}>
        {children ? children(review.media) : (
          <div>
            {review.media.map((item, index) => (
              <div key={index} data-media-type={item.type}>
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.alt || `Review media ${index + 1}`} />
                ) : (
                  <video src={item.url} aria-label={item.alt || `Review video ${index + 1}`} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

ReviewMedia.displayName = 'ReviewMedia'

// Helpful Button Component
export const ReviewHelpfulButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onHelpful?: (reviewId: string) => void
}>(
  ({ children, onHelpful, onClick, ...props }, ref) => {
    const { review } = useReview()

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      onHelpful?.(review.id)
      onClick?.(event)
    }, [onHelpful, review.id, onClick])

    return (
      <button
        ref={ref}
        type="button"
        data-slot="helpful-button"
        aria-label={`Mark review as helpful${review.helpful ? ` (${review.helpful} people found this helpful)` : ''}`}
        onClick={handleClick}
        {...props}
      >
        {children ?? `Helpful${review.helpful ? ` (${review.helpful})` : ''}`}
      </button>
    )
  }
)

ReviewHelpfulButton.displayName = 'ReviewHelpfulButton'

// Verified Badge Component
export const ReviewVerifiedBadge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, ...props }, ref) => {
    const { review } = useReview()

    if (!review.verified) return null

    return (
      <span
        ref={ref}
        data-slot="verified-badge"
        aria-label="Verified purchase"
        {...props}
      >
        {children ?? 'Verified Purchase'}
      </span>
    )
  }
)

ReviewVerifiedBadge.displayName = 'ReviewVerifiedBadge' 