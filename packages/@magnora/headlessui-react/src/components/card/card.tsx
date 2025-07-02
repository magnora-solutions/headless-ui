'use client'

import React, { createContext, useContext } from 'react'

// Types for card system
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  interactive?: boolean
  children: React.ReactNode
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: 'square' | 'video' | 'photo' | number
  children?: React.ReactNode
}

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between'
  children?: React.ReactNode
}

// Context for sharing card state
interface CardContextValue {
  variant: CardProps['variant']
  interactive: boolean
  isHovered: boolean
  isFocused: boolean
  isPressed: boolean
}

const CardContext = createContext<CardContextValue | null>(null)

// Hook to access card context
export function useCard() {
  const context = useContext(CardContext)
  if (!context) {
    throw new Error('Card components must be used within a Card component')
  }
  return context
}

// Main Card Component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default', 
    interactive = false, 
    children, 
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onMouseDown,
    onMouseUp,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [isPressed, setIsPressed] = React.useState(false)

    const handleMouseEnter = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        setIsHovered(true)
        onMouseEnter?.(event)
      }
    }, [interactive, onMouseEnter])

    const handleMouseLeave = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false)
      setIsPressed(false)
      onMouseLeave?.(event)
    }, [onMouseLeave])

    const handleFocus = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
      if (interactive) {
        setIsFocused(true)
        onFocus?.(event)
      }
    }, [interactive, onFocus])

    const handleBlur = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(false)
      onBlur?.(event)
    }, [onBlur])

    const handleMouseDown = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        setIsPressed(true)
        onMouseDown?.(event)
      }
    }, [interactive, onMouseDown])

    const handleMouseUp = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      setIsPressed(false)
      onMouseUp?.(event)
    }, [onMouseUp])

    const contextValue: CardContextValue = {
      variant,
      interactive,
      isHovered,
      isFocused,
      isPressed,
    }

    return (
      <CardContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-variant={variant}
          data-interactive={interactive}
          data-hovered={isHovered}
          data-focused={isFocused}
          data-pressed={isPressed}
          tabIndex={interactive ? 0 : undefined}
          role={interactive ? 'button' : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          {...props}
        >
          {children}
        </div>
      </CardContext.Provider>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="header" {...props}>
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Content Component
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="content" {...props}>
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer Component
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="footer" {...props}>
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

// Card Media Component
export const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ aspectRatio, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="media"
        data-aspect-ratio={aspectRatio}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardMedia.displayName = 'CardMedia'

// Card Actions Component
export const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ justify = 'start', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="actions"
        data-justify={justify}
        role="group"
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardActions.displayName = 'CardActions'

// Card Title Component
export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>(
  ({ as: Component = 'h3', children, ...props }, ref) => {
    return (
      <Component ref={ref} data-slot="title" {...props}>
        {children}
      </Component>
    )
  }
)

CardTitle.displayName = 'CardTitle'

// Card Description Component
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, ...props }, ref) => {
    return (
      <p ref={ref} data-slot="description" {...props}>
        {children}
      </p>
    )
  }
)

CardDescription.displayName = 'CardDescription' 