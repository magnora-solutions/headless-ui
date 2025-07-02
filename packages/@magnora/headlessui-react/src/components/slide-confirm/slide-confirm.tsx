'use client'

import React from 'react'

export interface SlideToConfirmProps extends React.HTMLAttributes<HTMLDivElement> {
  threshold?: number
  onConfirm?: () => void
  children?: React.ReactNode
}

export function SlideToConfirm({
  threshold = 0.8,
  onConfirm,
  children,
  ...props
}: SlideToConfirmProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState(0)
  const [startX, setStartX] = React.useState<number | null>(null)
  const [confirmed, setConfirmed] = React.useState(false)

  const clamp = (v: number) => Math.min(Math.max(v, 0), 1)

  const start = (clientX: number) => {
    setStartX(clientX)
  }

  const move = (clientX: number) => {
    if (startX === null || !trackRef.current) return
    const width = trackRef.current.offsetWidth || 1
    const delta = clientX - startX
    setPosition(clamp(delta / width))
  }

  const end = (clientX: number) => {
    if (startX === null) return
    move(clientX)
    if (position >= threshold && !confirmed) {
      setConfirmed(true)
      onConfirm?.()
    } else if (position < threshold) {
      setPosition(0)
    }
    setStartX(null)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    start(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    move(e.clientX)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    end(e.clientX)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    start(e.clientX)
  }
  const handleMouseMove = (e: React.MouseEvent) => move(e.clientX)
  const handleMouseUp = (e: React.MouseEvent) => end(e.clientX)

  return (
    <div
      ref={trackRef}
      role='button'
      aria-pressed={confirmed}
      data-slot='slide-confirm'
      data-position={position.toFixed(2)}
      data-confirmed={confirmed}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {children}
    </div>
  )
}

SlideToConfirm.displayName = 'SlideToConfirm'
