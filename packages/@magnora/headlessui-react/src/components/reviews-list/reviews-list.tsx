'use client'

import React, { createContext, useContext, useMemo } from 'react'
import type { ReviewData } from '../review/review'

// Types for reviews list system
export interface ReviewsListData {
  reviews: ReviewData[]
  totalCount: number
  averageRating: number
  ratingDistribution: {
    [key: number]: number // rating value -> count
  }
}

export interface SortOption {
  value: string
  label: string
  compareFn: (a: ReviewData, b: ReviewData) => number
}

export interface FilterOption {
  key: string
  label: string
  filterFn: (review: ReviewData) => boolean
}

export interface ReviewsListProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ReviewsListData
  sortBy?: string
  filterBy?: string[]
  searchQuery?: string
  onSortChange?: (sortBy: string) => void
  onFilterChange?: (filters: string[]) => void
  onSearchChange?: (query: string) => void
  onLoadMore?: () => void
  loading?: boolean
  hasMore?: boolean
  children: React.ReactNode
}

export interface ReviewsListHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface ReviewsListStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  showAverage?: boolean
  showTotal?: boolean
  showDistribution?: boolean
  children?: React.ReactNode
}

export interface ReviewsListFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface ReviewsListSortProps extends React.HTMLAttributes<HTMLDivElement> {
  options: SortOption[]
  children?: React.ReactNode
}

export interface ReviewsListSearchProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string
  children?: React.ReactNode
}

export interface ReviewsListItemsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: (reviews: ReviewData[]) => React.ReactNode
}

export interface ReviewsListPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface ReviewsListEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface ReviewsListLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

// Context for sharing reviews list state
interface ReviewsListContextValue {
  data: ReviewsListData
  sortBy?: string
  filterBy: string[]
  searchQuery: string
  filteredReviews: ReviewData[]
  loading: boolean
  hasMore: boolean
  onSortChange?: (sortBy: string) => void
  onFilterChange?: (filters: string[]) => void
  onSearchChange?: (query: string) => void
  onLoadMore?: () => void
}

const ReviewsListContext = createContext<ReviewsListContextValue | null>(null)

// Hook to access reviews list context
export function useReviewsList() {
  const context = useContext(ReviewsListContext)
  if (!context) {
    throw new Error('ReviewsList components must be used within a ReviewsList component')
  }
  return context
}

// Default sort options
export const defaultSortOptions: SortOption[] = [
  {
    value: 'newest',
    label: 'Newest First',
    compareFn: (a, b) => b.date.getTime() - a.date.getTime(),
  },
  {
    value: 'oldest',
    label: 'Oldest First',
    compareFn: (a, b) => a.date.getTime() - b.date.getTime(),
  },
  {
    value: 'highest-rating',
    label: 'Highest Rating',
    compareFn: (a, b) => b.rating - a.rating,
  },
  {
    value: 'lowest-rating',
    label: 'Lowest Rating',
    compareFn: (a, b) => a.rating - b.rating,
  },
  {
    value: 'most-helpful',
    label: 'Most Helpful',
    compareFn: (a, b) => (b.helpful || 0) - (a.helpful || 0),
  },
]

// Main Reviews List Component
export const ReviewsList = React.forwardRef<HTMLDivElement, ReviewsListProps>(
  ({ 
    data,
    sortBy,
    filterBy = [],
    searchQuery = '',
    onSortChange,
    onFilterChange,
    onSearchChange,
    onLoadMore,
    loading = false,
    hasMore = false,
    children,
    ...props 
  }, ref) => {
    const filteredReviews = useMemo(() => {
      let filtered = [...data.reviews]

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(review =>
          review.content.toLowerCase().includes(query) ||
          review.title?.toLowerCase().includes(query) ||
          review.author.name.toLowerCase().includes(query)
        )
      }

      // Apply custom filters (would be implemented based on filterBy array)
      // This is a simplified implementation
      filterBy.forEach(filter => {
        switch (filter) {
          case 'verified':
            filtered = filtered.filter(review => review.verified)
            break
          case 'with-media':
            filtered = filtered.filter(review => review.media && review.media.length > 0)
            break
          case '5-star':
            filtered = filtered.filter(review => review.rating === 5)
            break
          case '4-star':
            filtered = filtered.filter(review => review.rating === 4)
            break
          case '3-star':
            filtered = filtered.filter(review => review.rating === 3)
            break
          case '2-star':
            filtered = filtered.filter(review => review.rating === 2)
            break
          case '1-star':
            filtered = filtered.filter(review => review.rating === 1)
            break
        }
      })

      // Apply sorting
      if (sortBy) {
        const sortOption = defaultSortOptions.find(option => option.value === sortBy)
        if (sortOption) {
          filtered.sort(sortOption.compareFn)
        }
      }

      return filtered
    }, [data.reviews, searchQuery, filterBy, sortBy])

    const contextValue = useMemo<ReviewsListContextValue>(() => ({
      data,
      sortBy,
      filterBy,
      searchQuery,
      filteredReviews,
      loading,
      hasMore,
      onSortChange,
      onFilterChange,
      onSearchChange,
      onLoadMore,
    }), [data, sortBy, filterBy, searchQuery, filteredReviews, loading, hasMore, onSortChange, onFilterChange, onSearchChange, onLoadMore])

    return (
      <ReviewsListContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-total-reviews={data.totalCount}
          data-average-rating={data.averageRating}
          data-filtered-count={filteredReviews.length}
          data-loading={loading}
          {...props}
        >
          {children}
        </div>
      </ReviewsListContext.Provider>
    )
  }
)

ReviewsList.displayName = 'ReviewsList'

// Reviews List Header Component
export const ReviewsListHeader = React.forwardRef<HTMLDivElement, ReviewsListHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="header" {...props}>
        {children}
      </div>
    )
  }
)

ReviewsListHeader.displayName = 'ReviewsListHeader'

// Reviews List Stats Component
export const ReviewsListStats = React.forwardRef<HTMLDivElement, ReviewsListStatsProps>(
  ({ showAverage = true, showTotal = true, showDistribution = false, children, ...props }, ref) => {
    const { data } = useReviewsList()

    return (
      <div ref={ref} data-slot="stats" {...props}>
        {children ? children : (
          <div>
            {showAverage && (
              <div data-stat="average-rating">
                Average: {data.averageRating.toFixed(1)} / 5
              </div>
            )}
            {showTotal && (
              <div data-stat="total-count">
                Total Reviews: {data.totalCount}
              </div>
            )}
            {showDistribution && (
              <div data-stat="distribution">
                {Object.entries(data.ratingDistribution)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([rating, count]) => (
                    <div key={rating} data-rating={rating}>
                      {rating} stars: {count} reviews
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

ReviewsListStats.displayName = 'ReviewsListStats'

// Reviews List Sort Component
export const ReviewsListSort = React.forwardRef<HTMLDivElement, ReviewsListSortProps>(
  ({ options = defaultSortOptions, children, ...props }, ref) => {
    const { sortBy, onSortChange } = useReviewsList()

    const handleSortChange = React.useCallback((newSortBy: string) => {
      onSortChange?.(newSortBy)
    }, [onSortChange])

    return (
      <div ref={ref} data-slot="sort" {...props}>
        {children ? children : (
          <select 
            value={sortBy || ''} 
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Default Order</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }
)

ReviewsListSort.displayName = 'ReviewsListSort'

// Reviews List Search Component
export const ReviewsListSearch = React.forwardRef<HTMLDivElement, ReviewsListSearchProps>(
  ({ placeholder = 'Search reviews...', children, ...props }, ref) => {
    const { searchQuery, onSearchChange } = useReviewsList()

    const handleSearchChange = React.useCallback((query: string) => {
      onSearchChange?.(query)
    }, [onSearchChange])

    return (
      <div ref={ref} data-slot="search" {...props}>
        {children ? children : (
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        )}
      </div>
    )
  }
)

ReviewsListSearch.displayName = 'ReviewsListSearch'

// Reviews List Items Component
export const ReviewsListItems = React.forwardRef<HTMLDivElement, ReviewsListItemsProps>(
  ({ children, ...props }, ref) => {
    const { filteredReviews, loading } = useReviewsList()

    if (loading) return null

    return (
      <div ref={ref} data-slot="items" {...props}>
        {children ? children(filteredReviews) : (
          <div>
            {filteredReviews.map(review => (
              <div key={review.id} data-review-id={review.id}>
                {review.author.name}: {review.content}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

ReviewsListItems.displayName = 'ReviewsListItems'

// Reviews List Pagination Component
export const ReviewsListPagination = React.forwardRef<HTMLDivElement, ReviewsListPaginationProps>(
  ({ children, ...props }, ref) => {
    const { hasMore, loading, onLoadMore } = useReviewsList()

    if (!hasMore && !loading) return null

    return (
      <div ref={ref} data-slot="pagination" {...props}>
        {children ? children : (
          <button
            onClick={onLoadMore}
            disabled={loading}
            data-loading={loading}
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        )}
      </div>
    )
  }
)

ReviewsListPagination.displayName = 'ReviewsListPagination'

// Reviews List Empty State Component
export const ReviewsListEmpty = React.forwardRef<HTMLDivElement, ReviewsListEmptyProps>(
  ({ children, ...props }, ref) => {
    const { filteredReviews, loading } = useReviewsList()

    if (loading || filteredReviews.length > 0) return null

    return (
      <div ref={ref} data-slot="empty" {...props}>
        {children ? children : (
          <div>No reviews found.</div>
        )}
      </div>
    )
  }
)

ReviewsListEmpty.displayName = 'ReviewsListEmpty'

// Reviews List Loading Component
export const ReviewsListLoading = React.forwardRef<HTMLDivElement, ReviewsListLoadingProps>(
  ({ children, ...props }, ref) => {
    const { loading } = useReviewsList()

    if (!loading) return null

    return (
      <div ref={ref} data-slot="loading" {...props}>
        {children ? children : (
          <div>Loading reviews...</div>
        )}
      </div>
    )
  }
)

ReviewsListLoading.displayName = 'ReviewsListLoading' 