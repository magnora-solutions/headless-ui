'use client'

import React, { createContext, useContext, useReducer } from 'react'

// Types for review form system
export interface ReviewFormData {
  rating: number
  title: string
  content: string
  authorName: string
  authorEmail: string
  media: File[]
  termsAccepted: boolean
}

export interface ReviewFormErrors {
  rating?: string
  title?: string
  content?: string
  authorName?: string
  authorEmail?: string
  media?: string
  termsAccepted?: string
  general?: string
}

export interface ReviewFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  initialData?: Partial<ReviewFormData>
  onSubmit: (data: ReviewFormData) => Promise<void> | void
  onValidate?: (data: ReviewFormData) => ReviewFormErrors | null
  maxMediaFiles?: number
  maxMediaSize?: number // in MB
  allowedMediaTypes?: string[]
  requireTerms?: boolean
  children: React.ReactNode
}

export interface ReviewFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name: keyof ReviewFormData
  children?: React.ReactNode
}

export interface ReviewFormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode
}

export interface ReviewFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: keyof ReviewFormData
}

export interface ReviewFormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: keyof ReviewFormData
}

export interface ReviewFormRatingInputProps extends React.HTMLAttributes<HTMLDivElement> {
  name: 'rating'
  children?: React.ReactNode
}

export interface ReviewFormMediaInputProps extends React.HTMLAttributes<HTMLDivElement> {
  name: 'media'
  children?: React.ReactNode
}

export interface ReviewFormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: keyof ReviewFormData | 'general'
  children?: React.ReactNode
}

export interface ReviewFormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

// Form state management
interface ReviewFormState {
  data: ReviewFormData
  errors: ReviewFormErrors
  isSubmitting: boolean
  isDirty: boolean
}

type ReviewFormAction =
  | { type: 'SET_FIELD'; name: keyof ReviewFormData; value: any }
  | { type: 'SET_ERRORS'; errors: ReviewFormErrors }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM'; data?: Partial<ReviewFormData> }
  | { type: 'SET_DIRTY'; isDirty: boolean }

// Context for sharing form state
interface ReviewFormContextValue {
  state: ReviewFormState
  dispatch: React.Dispatch<ReviewFormAction>
  maxMediaFiles: number
  maxMediaSize: number
  allowedMediaTypes: string[]
  requireTerms: boolean
  onValidate?: (data: ReviewFormData) => ReviewFormErrors | null
}

const ReviewFormContext = createContext<ReviewFormContextValue | null>(null)

// Hook to access form context
export function useReviewForm() {
  const context = useContext(ReviewFormContext)
  if (!context) {
    throw new Error('ReviewForm components must be used within a ReviewForm component')
  }
  return context
}

// Default form data
const defaultFormData: ReviewFormData = {
  rating: 0,
  title: '',
  content: '',
  authorName: '',
  authorEmail: '',
  media: [],
  termsAccepted: false,
}

// Form reducer
function reviewFormReducer(state: ReviewFormState, action: ReviewFormAction): ReviewFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          [action.name]: action.value,
        },
        isDirty: true,
        errors: {
          ...state.errors,
          [action.name]: undefined, // Clear field error when user types
        },
      }
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      }
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      }
    case 'SET_DIRTY':
      return {
        ...state,
        isDirty: action.isDirty,
      }
    case 'RESET_FORM':
      return {
        data: { ...defaultFormData, ...action.data },
        errors: {},
        isSubmitting: false,
        isDirty: false,
      }
    default:
      return state
  }
}

// Validation function
function validateForm(data: ReviewFormData, requireTerms: boolean): ReviewFormErrors {
  const errors: ReviewFormErrors = {}

  if (data.rating === 0) {
    errors.rating = 'Please select a rating'
  }

  if (!data.content.trim()) {
    errors.content = 'Review content is required'
  } else if (data.content.length < 10) {
    errors.content = 'Review must be at least 10 characters long'
  }

  if (!data.authorName.trim()) {
    errors.authorName = 'Name is required'
  }

  if (!data.authorEmail.trim()) {
    errors.authorEmail = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.authorEmail)) {
    errors.authorEmail = 'Please enter a valid email address'
  }

  if (requireTerms && !data.termsAccepted) {
    errors.termsAccepted = 'You must accept the terms and conditions'
  }

  return errors
}

// Main Review Form Component
export const ReviewForm = React.forwardRef<HTMLFormElement, ReviewFormProps>(
  ({ 
    initialData,
    onSubmit,
    onValidate,
    maxMediaFiles = 5,
    maxMediaSize = 10, // 10MB
    allowedMediaTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
    requireTerms = true,
    children,
    ...props 
  }, ref) => {
    const [state, dispatch] = useReducer(reviewFormReducer, {
      data: { ...defaultFormData, ...initialData },
      errors: {},
      isSubmitting: false,
      isDirty: false,
    })

    const handleSubmit = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: true })

      // Validate form
      const validationErrors = onValidate ? onValidate(state.data) : validateForm(state.data, requireTerms)
      
      if (validationErrors && Object.keys(validationErrors).length > 0) {
        dispatch({ type: 'SET_ERRORS', errors: validationErrors })
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: false })
        return
      }

      try {
        await onSubmit(state.data)
        dispatch({ type: 'RESET_FORM' })
      } catch (error) {
        dispatch({ 
          type: 'SET_ERRORS', 
          errors: { general: error instanceof Error ? error.message : 'An error occurred' }
        })
      } finally {
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: false })
      }
    }, [state.data, onSubmit, onValidate, requireTerms])

    const contextValue: ReviewFormContextValue = {
      state,
      dispatch,
      maxMediaFiles,
      maxMediaSize,
      allowedMediaTypes,
      requireTerms,
      onValidate,
    }

    return (
      <ReviewFormContext.Provider value={contextValue}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          data-submitting={state.isSubmitting}
          data-dirty={state.isDirty}
          {...props}
        >
          {children}
        </form>
      </ReviewFormContext.Provider>
    )
  }
)

ReviewForm.displayName = 'ReviewForm'

// Form Field Wrapper Component
export const ReviewFormField = React.forwardRef<HTMLDivElement, ReviewFormFieldProps>(
  ({ name, children, ...props }, ref) => {
    const { state } = useReviewForm()
    const hasError = !!state.errors[name]

    return (
      <div
        ref={ref}
        data-field={name}
        data-error={hasError}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ReviewFormField.displayName = 'ReviewFormField'

// Form Label Component
export const ReviewFormLabel = React.forwardRef<HTMLLabelElement, ReviewFormLabelProps>(
  ({ children, ...props }, ref) => {
    return (
      <label ref={ref} {...props}>
        {children}
      </label>
    )
  }
)

ReviewFormLabel.displayName = 'ReviewFormLabel'

// Form Input Component
export const ReviewFormInput = React.forwardRef<HTMLInputElement, ReviewFormInputProps>(
  ({ name, onChange, ...props }, ref) => {
    const { state, dispatch } = useReviewForm()

    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
      dispatch({ type: 'SET_FIELD', name, value })
      onChange?.(event)
    }, [name, dispatch, onChange])

    return (
      <input
        ref={ref}
        name={name}
        value={state.data[name] as string}
        onChange={handleChange}
        data-error={!!state.errors[name]}
        {...props}
      />
    )
  }
)

ReviewFormInput.displayName = 'ReviewFormInput'

// Form Textarea Component
export const ReviewFormTextarea = React.forwardRef<HTMLTextAreaElement, ReviewFormTextareaProps>(
  ({ name, onChange, ...props }, ref) => {
    const { state, dispatch } = useReviewForm()

    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch({ type: 'SET_FIELD', name, value: event.target.value })
      onChange?.(event)
    }, [name, dispatch, onChange])

    return (
      <textarea
        ref={ref}
        name={name}
        value={state.data[name] as string}
        onChange={handleChange}
        data-error={!!state.errors[name]}
        {...props}
      />
    )
  }
)

ReviewFormTextarea.displayName = 'ReviewFormTextarea'

// Form Rating Input Component
export const ReviewFormRatingInput = React.forwardRef<HTMLDivElement, ReviewFormRatingInputProps>(
  ({ name, children, ...props }, ref) => {
    const { state, dispatch } = useReviewForm()

    const handleRatingChange = React.useCallback((rating: number) => {
      dispatch({ type: 'SET_FIELD', name, value: rating })
    }, [name, dispatch])

    return (
      <div
        ref={ref}
        data-field={name}
        data-rating={state.data.rating}
        data-error={!!state.errors[name]}
        {...props}
      >
        {children || (
          <div>
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                data-filled={state.data.rating >= rating}
                aria-label={`Rate ${rating} stars`}
              >
                ★
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)

ReviewFormRatingInput.displayName = 'ReviewFormRatingInput'

// Form Media Input Component
export const ReviewFormMediaInput = React.forwardRef<HTMLDivElement, ReviewFormMediaInputProps>(
  ({ name, children, ...props }, ref) => {
    const { state, dispatch, maxMediaFiles, maxMediaSize, allowedMediaTypes } = useReviewForm()

    const handleFileChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      
      // Validate file count
      if (files.length > maxMediaFiles) {
        dispatch({ 
          type: 'SET_ERRORS', 
          errors: { ...state.errors, media: `Maximum ${maxMediaFiles} files allowed` }
        })
        return
      }

      // Validate file types and sizes
      for (const file of files) {
        if (!allowedMediaTypes.includes(file.type)) {
          dispatch({ 
            type: 'SET_ERRORS', 
            errors: { ...state.errors, media: `File type ${file.type} not allowed` }
          })
          return
        }

        if (file.size > maxMediaSize * 1024 * 1024) {
          dispatch({ 
            type: 'SET_ERRORS', 
            errors: { ...state.errors, media: `File size must be less than ${maxMediaSize}MB` }
          })
          return
        }
      }

      dispatch({ type: 'SET_FIELD', name, value: files })
    }, [name, dispatch, maxMediaFiles, maxMediaSize, allowedMediaTypes, state.errors])

    return (
      <div
        ref={ref}
        data-field={name}
        data-error={!!state.errors[name]}
        {...props}
      >
        {children || (
          <input
            type="file"
            multiple
            accept={allowedMediaTypes.join(',')}
            onChange={handleFileChange}
          />
        )}
      </div>
    )
  }
)

ReviewFormMediaInput.displayName = 'ReviewFormMediaInput'

// Form Error Component
export const ReviewFormError = React.forwardRef<HTMLDivElement, ReviewFormErrorProps>(
  ({ name = 'general', children, ...props }, ref) => {
    const { state } = useReviewForm()
    const error = state.errors[name]

    if (!error) return null

    return (
      <div
        ref={ref}
        role="alert"
        data-error-field={name}
        {...props}
      >
        {children || error}
      </div>
    )
  }
)

ReviewFormError.displayName = 'ReviewFormError'

// Form Submit Button Component
export const ReviewFormSubmit = React.forwardRef<HTMLButtonElement, ReviewFormSubmitProps>(
  ({ children, disabled, ...props }, ref) => {
    const { state } = useReviewForm()
    const isDisabled = disabled || state.isSubmitting

    return (
      <button
        ref={ref}
        type="submit"
        disabled={isDisabled}
        data-submitting={state.isSubmitting}
        {...props}
      >
        {children || (state.isSubmitting ? 'Submitting...' : 'Submit Review')}
      </button>
    )
  }
)

ReviewFormSubmit.displayName = 'ReviewFormSubmit' 