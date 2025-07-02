'use client'

import React from 'react'
import { useHover, usePress, useFocus } from '@react-aria/interactions'
import type { PressEvent, HoverEvent } from '@react-types/shared'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onFocus' | 'onBlur'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  // React Aria interaction props
  onPress?: (e: PressEvent) => void
  onPressStart?: (e: PressEvent) => void
  onPressEnd?: (e: PressEvent) => void
  onHoverStart?: (e: HoverEvent) => void
  onHoverEnd?: (e: HoverEvent) => void
  onFocusChange?: (isFocused: boolean) => void
}

export interface ButtonState {
  isPressed: boolean
  isHovered: boolean
  isFocused: boolean
  isDisabled: boolean
  isLoading: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    onPress,
    onPressStart,
    onPressEnd,
    onHoverStart,
    onHoverEnd,
    onFocusChange,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    // React Aria hooks for professional interactions
    const { hoverProps, isHovered } = useHover({
      isDisabled,
      onHoverStart,
      onHoverEnd,
    })

    const { pressProps, isPressed } = usePress({
      isDisabled,
      onPress,
      onPressStart,
      onPressEnd,
    })

    const { focusProps } = useFocus({
      isDisabled,
      onFocusChange,
    })

    // Track focus state separately since useFocus doesn't return isFocused
    const [isFocused, setIsFocused] = React.useState(false)
    
    const enhancedFocusProps = {
      ...focusProps,
      onFocus: (e: React.FocusEvent<HTMLButtonElement>) => {
        setIsFocused(true)
        focusProps.onFocus?.(e)
      },
      onBlur: (e: React.FocusEvent<HTMLButtonElement>) => {
        setIsFocused(false)
        focusProps.onBlur?.(e)
      },
    }

    const buttonState: ButtonState = {
      isPressed,
      isHovered,
      isFocused,
      isDisabled,
      isLoading: loading,
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        data-variant={variant}
        data-size={size}
        data-state={JSON.stringify(buttonState)}
        data-pressed={isPressed}
        data-hovered={isHovered}
        data-focused={isFocused}
        data-disabled={isDisabled}
        data-loading={loading}
        {...hoverProps}
        {...pressProps}
        {...enhancedFocusProps}
        {...props}
      >
        {leftIcon && (
          <span data-slot="left-icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span data-slot="content">
          {loading ? (
            <span data-slot="loading" aria-label="Loading...">
              {children}
            </span>
          ) : (
            children
          )}
        </span>
        {rightIcon && (
          <span data-slot="right-icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Hook for accessing button state in child components
export function useButtonState(): ButtonState {
  // This would typically be used with a context, but for simplicity
  // we'll return a default state. In practice, you'd wrap this in a context provider.
  return {
    isPressed: false,
    isHovered: false,
    isFocused: false,
    isDisabled: false,
    isLoading: false,
  }
}