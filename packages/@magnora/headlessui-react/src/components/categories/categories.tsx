'use client'

import React, { createContext, useContext } from 'react'
import { usePress } from '@react-aria/interactions'
import type { PressEvent } from '@react-types/shared'

export interface CategoryItem {
  id: string
  label: string
}

interface CategoriesContextValue {
  selectedId: string | null
  selectCategory: (id: string) => void
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null)

export function useCategories() {
  const ctx = useContext(CategoriesContext)
  if (!ctx) {
    throw new Error('Categories components must be used within CategoriesProvider')
  }
  return ctx
}

export interface CategoriesProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: CategoryItem[]
  selectedId?: string | null
  onCategoryChange?: (id: string) => void
  children?: React.ReactNode
}

export function CategoriesProvider({
  categories,
  selectedId = null,
  onCategoryChange,
  children,
  ...props
}: CategoriesProviderProps) {
  const [active, setActive] = React.useState<string | null>(selectedId)

  const selectCategory = React.useCallback(
    (id: string) => {
      setActive(id)
      onCategoryChange?.(id)
    },
    [onCategoryChange]
  )

  const ctx: CategoriesContextValue = {
    selectedId: active,
    selectCategory,
  }

  return (
    <CategoriesContext.Provider value={ctx}>
      <div data-slot="categories" {...props}>
        {categories.map(cat => (
          <Category key={cat.id} id={cat.id}>
            {cat.label}
          </Category>
        ))}
        {children}
      </div>
    </CategoriesContext.Provider>
  )
}

CategoriesProvider.displayName = 'CategoriesProvider'

export interface CategoryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string
  children: React.ReactNode
}

export function Category({ id, children, ...props }: CategoryProps) {
  const { selectedId, selectCategory } = useCategories()

  const handlePress = React.useCallback(
    (e: PressEvent) => {
      selectCategory(id)
    },
    [selectCategory, id]
  )

  const { pressProps } = usePress({ onPress: handlePress })

  return (
    <button
      type="button"
      data-slot="category"
      data-selected={selectedId === id}
      {...pressProps}
      {...props}
    >
      {children}
    </button>
  )
}

Category.displayName = 'Category'
