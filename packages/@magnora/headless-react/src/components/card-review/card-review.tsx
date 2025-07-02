import React, { forwardRef } from 'react';
import { useShopifyReviews, ShopifyReview } from '../../providers/shopify-provider';

export interface CardReviewProps {
  productId: string;
  maxReviews?: number;
  showRating?: boolean;
  showSummary?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Main CardReview component - displays a compact summary of reviews
export const CardReview = forwardRef<HTMLDivElement, CardReviewProps>(
  ({ 
    productId, 
    maxReviews = 3, 
    showRating = true, 
    showSummary = true,
    className,
    children,
    ...props 
  }, ref) => {
    const { reviews, isLoading, error } = useShopifyReviews(productId, {
      limit: maxReviews,
      sortBy: 'rating',
      sortOrder: 'desc'
    });

    if (isLoading) {
      return (
        <div 
          ref={ref}
          data-magnora-card-review="true"
          data-loading="true"
          className={className}
          {...props}
        >
          {children || <CardReviewLoading />}
        </div>
      );
    }

    if (error) {
      return (
        <div 
          ref={ref}
          data-magnora-card-review="true"
          data-error="true"
          className={className}
          {...props}
        >
          <CardReviewError error={error} />
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <div 
          ref={ref}
          data-magnora-card-review="true"
          data-empty="true"
          className={className}
          {...props}
        >
          <CardReviewEmpty />
        </div>
      );
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const totalReviews = reviews.length;

    return (
      <div 
        ref={ref}
        data-magnora-card-review="true"
        className={className}
        {...props}
      >
        {children || (
          <>
            {showRating && (
              <CardReviewHeader>
                <CardReviewRating rating={averageRating} count={totalReviews} />
              </CardReviewHeader>
            )}
            
            <CardReviewContent>
              {reviews.slice(0, maxReviews).map((review) => (
                <CardReviewItem key={review.id} review={review} />
              ))}
            </CardReviewContent>

            {showSummary && totalReviews > maxReviews && (
              <CardReviewFooter>
                <CardReviewSummary 
                  totalReviews={totalReviews} 
                  showing={maxReviews}
                  productId={productId}
                />
              </CardReviewFooter>
            )}
          </>
        )}
      </div>
    );
  }
);

CardReview.displayName = 'CardReview';

// Sub-components for flexible composition
export interface CardReviewHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardReviewHeader = forwardRef<HTMLDivElement, CardReviewHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref}
      data-magnora-card-review-header="true"
      className={className}
      {...props}
    >
      {children}
    </div>
  )
);

CardReviewHeader.displayName = 'CardReviewHeader';

export interface CardReviewContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardReviewContent = forwardRef<HTMLDivElement, CardReviewContentProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref}
      data-magnora-card-review-content="true"
      className={className}
      {...props}
    >
      {children}
    </div>
  )
);

CardReviewContent.displayName = 'CardReviewContent';

export interface CardReviewFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardReviewFooter = forwardRef<HTMLDivElement, CardReviewFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref}
      data-magnora-card-review-footer="true"
      className={className}
      {...props}
    >
      {children}
    </div>
  )
);

CardReviewFooter.displayName = 'CardReviewFooter';

// Rating display for card
export interface CardReviewRatingProps {
  rating: number;
  count: number;
  maxStars?: number;
  starSymbol?: string;
  emptyStarSymbol?: string;
  className?: string;
}

export const CardReviewRating = forwardRef<HTMLDivElement, CardReviewRatingProps>(
  ({ 
    rating, 
    count, 
    maxStars = 5, 
    starSymbol = '★', 
    emptyStarSymbol = '☆',
    className,
    ...props 
  }, ref) => {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - filledStars - (hasHalfStar ? 1 : 0);

    return (
      <div 
        ref={ref}
        data-magnora-card-review-rating="true"
        className={className}
        {...props}
      >
        <div data-magnora-card-review-stars="true">
          {/* Filled stars */}
          {Array.from({ length: filledStars }, (_, i) => (
            <span 
              key={`filled-${i}`}
              data-magnora-star="true"
              data-filled="true"
            >
              {starSymbol}
            </span>
          ))}
          
          {/* Half star */}
          {hasHalfStar && (
            <span 
              data-magnora-star="true"
              data-filled="half"
            >
              {starSymbol}
            </span>
          )}
          
          {/* Empty stars */}
          {Array.from({ length: emptyStars }, (_, i) => (
            <span 
              key={`empty-${i}`}
              data-magnora-star="true"
              data-filled="false"
            >
              {emptyStarSymbol}
            </span>
          ))}
        </div>
        
        <div data-magnora-card-review-rating-text="true">
          {rating.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
        </div>
      </div>
    );
  }
);

CardReviewRating.displayName = 'CardReviewRating';

// Individual review item in card
export interface CardReviewItemProps {
  review: ShopifyReview;
  truncateLength?: number;
  className?: string;
}

export const CardReviewItem = forwardRef<HTMLDivElement, CardReviewItemProps>(
  ({ review, truncateLength = 120, className, ...props }, ref) => {
    const truncatedContent = review.content.length > truncateLength
      ? `${review.content.substring(0, truncateLength)}...`
      : review.content;

    return (
      <div 
        ref={ref}
        data-magnora-card-review-item="true"
        className={className}
        {...props}
      >
        <div data-magnora-card-review-item-header="true">
          <span data-magnora-card-review-item-author="true">
            {review.author}
          </span>
          <div data-magnora-card-review-item-rating="true">
            {Array.from({ length: review.rating }, (_, i) => (
              <span key={i} data-magnora-star="true" data-filled="true">★</span>
            ))}
          </div>
        </div>
        
        {review.title && (
          <div data-magnora-card-review-item-title="true">
            {review.title}
          </div>
        )}
        
        <div data-magnora-card-review-item-content="true">
          {truncatedContent}
        </div>
        
        <div data-magnora-card-review-item-meta="true">
          <span data-magnora-card-review-item-date="true">
            {new Date(review.date).toLocaleDateString()}
          </span>
          {review.verified && (
            <span data-magnora-card-review-item-verified="true">
              Verified Purchase
            </span>
          )}
        </div>
      </div>
    );
  }
);

CardReviewItem.displayName = 'CardReviewItem';

// Summary component
export interface CardReviewSummaryProps {
  totalReviews: number;
  showing: number;
  productId: string;
  onViewAll?: () => void;
  className?: string;
}

export const CardReviewSummary = forwardRef<HTMLDivElement, CardReviewSummaryProps>(
  ({ totalReviews, showing, productId, onViewAll, className, ...props }, ref) => (
    <div 
      ref={ref}
      data-magnora-card-review-summary="true"
      className={className}
      {...props}
    >
      <span data-magnora-card-review-summary-text="true">
        Showing {showing} of {totalReviews} reviews
      </span>
      {onViewAll && (
        <button 
          data-magnora-card-review-summary-button="true"
          onClick={onViewAll}
          type="button"
        >
          View All Reviews
        </button>
      )}
    </div>
  )
);

CardReviewSummary.displayName = 'CardReviewSummary';

// Loading state
export const CardReviewLoading = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref}
      data-magnora-card-review-loading="true"
      className={className}
      {...props}
    >
      <div data-magnora-card-review-loading-text="true">
        Loading reviews...
      </div>
    </div>
  )
);

CardReviewLoading.displayName = 'CardReviewLoading';

// Error state
export interface CardReviewErrorProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const CardReviewError = forwardRef<HTMLDivElement, CardReviewErrorProps>(
  ({ error, onRetry, className, ...props }, ref) => (
    <div 
      ref={ref}
      data-magnora-card-review-error="true"
      className={className}
      {...props}
    >
      <div data-magnora-card-review-error-text="true">
        Failed to load reviews: {error}
      </div>
      {onRetry && (
        <button 
          data-magnora-card-review-error-button="true"
          onClick={onRetry}
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  )
);

CardReviewError.displayName = 'CardReviewError';

// Empty state
export const CardReviewEmpty = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref}
      data-magnora-card-review-empty="true"
      className={className}
      {...props}
    >
      <div data-magnora-card-review-empty-text="true">
        No reviews yet. Be the first to review this product!
      </div>
    </div>
  )
);

CardReviewEmpty.displayName = 'CardReviewEmpty'; 