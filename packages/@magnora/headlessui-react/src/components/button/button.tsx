'use client'

import React from 'react'
import { useHover } from '@react-aria/interactions'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { hoverProps, isHovered } = useHover({})

    return (
        <button
            {...hoverProps}
            ref={ref}
            {...props}
            className={`rounded px-4 py-2 font-medium transition-colors ${
                isHovered ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
            } ${props.className ?? ''}`}
        >
            {props.children}
        </button>
    )
})

Button.displayName = 'Button'