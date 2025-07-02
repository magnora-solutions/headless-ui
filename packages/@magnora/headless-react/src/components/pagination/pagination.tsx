import React, { forwardRef } from 'react';
import { usePress, useHover } from '@react-aria/interactions';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  showItemCount?: boolean;
  maxVisiblePages?: number;
  className?: string;
  children?: React.ReactNode;
}

// Main Pagination component
export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ 
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    showPageNumbers = true,
    showItemCount = true,
    maxVisiblePages = 7,
    className,
    children,
    ...props 
  }, ref) => {
    if (totalPages <= 1) {
      return null; // Don't show pagination for single page
    }

    return (
      <div 
        ref={ref}
        data-magnora-pagination="true"
        className={className}
        role="navigation"
        aria-label="Pagination"
        {...props}
      >
        {children || (
          <>
            {showItemCount && (
              <PaginationInfo 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            )}
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showFirstLast={showFirstLast}
              showPrevNext={showPrevNext}
              showPageNumbers={showPageNumbers}
              maxVisiblePages={maxVisiblePages}
            />
          </>
        )}
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';

// Pagination info component
export interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export const PaginationInfo = forwardRef<HTMLDivElement, PaginationInfoProps>(
  ({ currentPage, totalPages, totalItems, itemsPerPage, className, ...props }, ref) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div 
        ref={ref}
        data-magnora-pagination-info="true"
        className={className}
        {...props}
      >
        Showing {startItem}-{endItem} of {totalItems} results
      </div>
    );
  }
);

PaginationInfo.displayName = 'PaginationInfo';

// Pagination controls
export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast: boolean;
  showPrevNext: boolean;
  showPageNumbers: boolean;
  maxVisiblePages: number;
  className?: string;
}

export const PaginationControls = forwardRef<HTMLDivElement, PaginationControlsProps>(
  ({ 
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast,
    showPrevNext,
    showPageNumbers,
    maxVisiblePages,
    className,
    ...props 
  }, ref) => {
    return (
      <div 
        ref={ref}
        data-magnora-pagination-controls="true"
        className={className}
        {...props}
      >
        {/* First page button */}
        {showFirstLast && currentPage > 1 && (
          <PaginationButton
            page={1}
            onPageChange={onPageChange}
            label="First page"
            variant="first"
          >
            ««
          </PaginationButton>
        )}

        {/* Previous page button */}
        {showPrevNext && currentPage > 1 && (
          <PaginationButton
            page={currentPage - 1}
            onPageChange={onPageChange}
            label="Previous page"
            variant="prev"
          >
            ‹
          </PaginationButton>
        )}

        {/* Page numbers */}
        {showPageNumbers && (
          <PaginationPageNumbers
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            maxVisiblePages={maxVisiblePages}
          />
        )}

        {/* Next page button */}
        {showPrevNext && currentPage < totalPages && (
          <PaginationButton
            page={currentPage + 1}
            onPageChange={onPageChange}
            label="Next page"
            variant="next"
          >
            ›
          </PaginationButton>
        )}

        {/* Last page button */}
        {showFirstLast && currentPage < totalPages && (
          <PaginationButton
            page={totalPages}
            onPageChange={onPageChange}
            label="Last page"
            variant="last"
          >
            »»
          </PaginationButton>
        )}
      </div>
    );
  }
);

PaginationControls.displayName = 'PaginationControls';

// Page numbers component
export interface PaginationPageNumbersProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages: number;
  className?: string;
}

export const PaginationPageNumbers = forwardRef<HTMLDivElement, PaginationPageNumbersProps>(
  ({ currentPage, totalPages, onPageChange, maxVisiblePages, className, ...props }, ref) => {
    const getVisiblePageRange = () => {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);

      // Adjust if we're near the beginning or end
      if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      }

      return { startPage, endPage };
    };

    const { startPage, endPage } = getVisiblePageRange();
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
      <div 
        ref={ref}
        data-magnora-pagination-page-numbers="true"
        className={className}
        {...props}
      >
        {/* Show ellipsis if we're not starting from page 1 */}
        {startPage > 1 && (
          <>
            <PaginationButton
              page={1}
              onPageChange={onPageChange}
              label="Page 1"
            >
              1
            </PaginationButton>
            {startPage > 2 && (
              <PaginationEllipsis />
            )}
          </>
        )}

        {/* Render visible page numbers */}
        {pages.map((page) => (
          <PaginationButton
            key={page}
            page={page}
            onPageChange={onPageChange}
            label={`Page ${page}`}
            isCurrent={page === currentPage}
          >
            {page}
          </PaginationButton>
        ))}

        {/* Show ellipsis if we're not ending at the last page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationEllipsis />
            )}
            <PaginationButton
              page={totalPages}
              onPageChange={onPageChange}
              label={`Page ${totalPages}`}
            >
              {totalPages}
            </PaginationButton>
          </>
        )}
      </div>
    );
  }
);

PaginationPageNumbers.displayName = 'PaginationPageNumbers';

// Individual pagination button
export interface PaginationButtonProps {
  page: number;
  onPageChange: (page: number) => void;
  label: string;
  isCurrent?: boolean;
  variant?: 'first' | 'prev' | 'next' | 'last' | 'page';
  children: React.ReactNode;
  className?: string;
}

export const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ 
    page, 
    onPageChange, 
    label, 
    isCurrent = false, 
    variant = 'page',
    children, 
    className,
    ...props 
  }, ref) => {
    const { pressProps } = usePress({
      onPress: () => onPageChange(page)
    });

    const { hoverProps, isHovered } = useHover({});

    return (
      <button
        ref={ref}
        type="button"
        data-magnora-pagination-button="true"
        data-current={isCurrent}
        data-variant={variant}
        data-hovered={isHovered}
        className={className}
        aria-label={label}
        aria-current={isCurrent ? 'page' : undefined}
        disabled={isCurrent}
        {...pressProps}
        {...hoverProps}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PaginationButton.displayName = 'PaginationButton';

// Ellipsis component
export const PaginationEllipsis = forwardRef<HTMLSpanElement, { className?: string }>(
  ({ className, ...props }, ref) => (
    <span 
      ref={ref}
      data-magnora-pagination-ellipsis="true"
      className={className}
      aria-hidden="true"
      {...props}
    >
      …
    </span>
  )
);

PaginationEllipsis.displayName = 'PaginationEllipsis';

// Hook for pagination logic
export interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination({ 
  totalItems, 
  itemsPerPage, 
  initialPage = 1 
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

  const goToPage = React.useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = React.useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = React.useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  const reset = React.useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Reset to page 1 if totalItems changes dramatically
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalItems, totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    reset,
  };
} 