# Magnora Headless UI Components

A comprehensive collection of headless React components for building modern review and rating systems. These components provide logic, state management, and accessibility without any styling, giving you complete control over the visual design.

## Design Philosophy

**Headless UI** means components that:
- ✅ Provide logic, state, and accessibility behaviors
- ✅ Use **React Aria** for industry-leading accessibility and interactions
- ✅ Use data attributes for styling hooks
- ✅ Support full customization through children props
- ❌ Don't include any CSS styles or visual design
- ❌ Don't impose specific markup structure

### React Aria Integration

All interactive components use [React Aria](https://react-spectrum.adobe.com/react-aria/) hooks for:
- **Professional interactions**: Proper hover, press, and focus handling
- **Cross-platform support**: Works consistently across desktop, mobile, and assistive technologies  
- **Accessibility compliance**: WCAG 2.1 AA standards out of the box
- **Keyboard navigation**: Full keyboard support with proper focus management
- **Touch interactions**: Optimized for touch devices with proper gesture handling

## Core Components

### 1. Rating Components

#### `Rating` - Interactive Rating Input
```tsx
import { Rating, Stars } from '@magnora/headlessui-react'

// Basic usage
<Rating value={rating} onChange={setRating}>
  <Stars />
</Rating>

// Advanced usage with custom rendering
<Rating 
  value={rating} 
  onChange={setRating}
  maxRating={10}
  precision="half"
  onHover={handleHover}
>
  <Stars>
    {({ index, filled, halfFilled }) => (
      <Star key={index} index={index} filled={filled} halfFilled={halfFilled}>
        <MyCustomStarIcon filled={filled} />
      </Star>
    )}
  </Stars>
</Rating>
```

#### `RatingDisplay` - Read-only Rating Display
```tsx
import { RatingDisplay, Stars, RatingCount } from '@magnora/headlessui-react'

<RatingDisplay value={4.2} totalReviews={123}>
  <Stars />
  <RatingCount />
</RatingDisplay>
```

**Key Features:**
- **React Aria interactions**: Professional hover and press handling for stars
- Interactive vs display-only modes
- Half-star precision support
- Custom max rating (default: 5)
- Touch-friendly interactions for mobile devices
- Full accessibility with ARIA attributes and keyboard navigation
- Data attributes for styling: `data-rating`, `data-filled`, `data-fill-percentage`

### 2. Review Components

#### `Review` - Individual Review Display
```tsx
import { 
  Review, 
  ReviewAvatar, 
  ReviewAuthor, 
  ReviewTitle, 
  ReviewContent, 
  ReviewRating,
  ReviewDate,
  ReviewActions,
  ReviewHelpfulButton,
  ReviewVerifiedBadge 
} from '@magnora/headlessui-react'

<Review review={reviewData}>
  <ReviewAvatar />
  <div>
    <ReviewAuthor />
    <ReviewVerifiedBadge />
    <ReviewRating>
      <RatingDisplay value={reviewData.rating}>
        <Stars />
      </RatingDisplay>
    </ReviewRating>
  </div>
  <ReviewTitle />
  <ReviewContent />
  <ReviewDate format={(date) => date.toLocaleDateString()} />
  <ReviewActions>
    <ReviewHelpfulButton onHelpful={handleHelpful} />
  </ReviewActions>
</Review>
```

**Key Features:**
- Context-based data sharing
- Media attachments support
- Verification badges
- Helpful voting system
- Flexible component composition
- Data attributes: `data-review-id`, `data-rating`, `data-verified`

### 3. Card Layout Components

#### `Card` - Flexible Card Container
```tsx
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardActions 
} from '@magnora/headlessui-react'

<Card variant="elevated" interactive>
  <CardHeader>
    <CardTitle>Product Review</CardTitle>
  </CardHeader>
  <CardContent>
    <Review review={data}>
      {/* Review components */}
    </Review>
  </CardContent>
  <CardFooter>
    <CardActions justify="between">
      <button>Edit</button>
      <button>Delete</button>
    </CardActions>
  </CardFooter>
</Card>
```

**Key Features:**
- Multiple variants: `default`, `elevated`, `outlined`, `filled`
- Interactive states (hover, focus, press)
- Flexible slot-based composition
- Data attributes: `data-variant`, `data-interactive`, `data-hovered`

### 4. Reviews List Components

#### `ReviewsList` - Collection Management
```tsx
import { 
  ReviewsList,
  ReviewsListHeader,
  ReviewsListStats,
  ReviewsListSort,
  ReviewsListSearch,
  ReviewsListItems,
  ReviewsListPagination,
  ReviewsListEmpty,
  ReviewsListLoading
} from '@magnora/headlessui-react'

<ReviewsList 
  data={reviewsData}
  sortBy={sortBy}
  filterBy={filters}
  searchQuery={search}
  onSortChange={setSortBy}
  onFilterChange={setFilters}
  onSearchChange={setSearch}
  onLoadMore={loadMore}
  loading={loading}
  hasMore={hasMore}
>
  <ReviewsListHeader>
    <ReviewsListStats showDistribution />
    <div style={{ display: 'flex', gap: '1rem' }}>
      <ReviewsListSearch />
      <ReviewsListSort />
    </div>
  </ReviewsListHeader>
  
  <ReviewsListItems>
    {(reviews) => reviews.map(review => (
      <Card key={review.id}>
        <Review review={review}>
          {/* Review components */}
        </Review>
      </Card>
    ))}
  </ReviewsListItems>
  
  <ReviewsListEmpty>
    <p>No reviews match your criteria.</p>
  </ReviewsListEmpty>
  
  <ReviewsListLoading>
    <p>Loading more reviews...</p>
  </ReviewsListLoading>
  
  <ReviewsListPagination />
</ReviewsList>
```

**Key Features:**
- Built-in filtering and sorting
- Search functionality
- Pagination support
- Statistics display
- Empty and loading states
- Data attributes: `data-total-reviews`, `data-filtered-count`, `data-loading`

### 5. Review Form Components

#### `ReviewForm` - Review Creation Form
```tsx
import { 
  ReviewForm,
  ReviewFormField,
  ReviewFormLabel,
  ReviewFormRatingInput,
  ReviewFormInput,
  ReviewFormTextarea,
  ReviewFormMediaInput,
  ReviewFormError,
  ReviewFormSubmit
} from '@magnora/headlessui-react'

<ReviewForm
  onSubmit={handleSubmit}
  maxMediaFiles={5}
  maxMediaSize={10}
  allowedMediaTypes={['image/jpeg', 'image/png', 'video/mp4']}
>
  <ReviewFormField name="rating">
    <ReviewFormLabel>Rating</ReviewFormLabel>
    <ReviewFormRatingInput name="rating">
      <Rating value={0} onChange={() => {}}>
        <Stars />
      </Rating>
    </ReviewFormRatingInput>
    <ReviewFormError name="rating" />
  </ReviewFormField>

  <ReviewFormField name="title">
    <ReviewFormLabel>Title (optional)</ReviewFormLabel>
    <ReviewFormInput name="title" placeholder="Summary of your review" />
    <ReviewFormError name="title" />
  </ReviewFormField>

  <ReviewFormField name="content">
    <ReviewFormLabel>Review</ReviewFormLabel>
    <ReviewFormTextarea 
      name="content" 
      placeholder="Share your experience..."
      rows={4}
    />
    <ReviewFormError name="content" />
  </ReviewFormField>

  <ReviewFormField name="authorName">
    <ReviewFormLabel>Your Name</ReviewFormLabel>
    <ReviewFormInput name="authorName" />
    <ReviewFormError name="authorName" />
  </ReviewFormField>

  <ReviewFormField name="authorEmail">
    <ReviewFormLabel>Email</ReviewFormLabel>
    <ReviewFormInput name="authorEmail" type="email" />
    <ReviewFormError name="authorEmail" />
  </ReviewFormField>

  <ReviewFormField name="media">
    <ReviewFormLabel>Photos/Videos (optional)</ReviewFormLabel>
    <ReviewFormMediaInput name="media" />
    <ReviewFormError name="media" />
  </ReviewFormField>

  <ReviewFormField name="termsAccepted">
    <ReviewFormInput name="termsAccepted" type="checkbox" />
    <ReviewFormLabel>I agree to the terms and conditions</ReviewFormLabel>
    <ReviewFormError name="termsAccepted" />
  </ReviewFormField>

  <ReviewFormError name="general" />
  <ReviewFormSubmit />
</ReviewForm>
```

**Key Features:**
- Built-in validation and error handling
- File upload with type/size validation
- Form state management with useReducer
- Accessibility support
- Data attributes: `data-submitting`, `data-dirty`, `data-error`

### 6. Button Components

#### `Button` - Interactive Button
```tsx
import { Button } from '@magnora/headlessui-react'

<Button 
  variant="primary"
  size="lg"
  loading={isLoading}
  leftIcon={<IconCheck />}
  rightIcon={<IconArrow />}
  onPress={handlePress}
  onHoverStart={handleHoverStart}
  onHoverEnd={handleHoverEnd}
  onFocusChange={handleFocusChange}
>
  Submit Review
</Button>
```

**Key Features:**
- **React Aria interactions**: `onPress`, `onHoverStart`, `onHoverEnd`, `onFocusChange`
- Multiple variants and sizes
- Loading states with proper aria-busy
- Icon support with accessibility
- Professional interaction states (hover, focus, press)
- Data attributes: `data-variant`, `data-size`, `data-loading`, `data-hovered`

## Styling with Data Attributes

All components use data attributes for styling hooks:

```css
/* Button styling */
button[data-variant="primary"] {
  background: blue;
  color: white;
}

button[data-variant="primary"][data-hovered="true"] {
  background: darkblue;
}

/* Rating styling */
[data-slot="rating"] [data-filled="true"] {
  color: gold;
}

[data-slot="rating"] [data-filled="false"] {
  color: gray;
}

/* Card styling */
[data-variant="elevated"] {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

[data-interactive="true"][data-hovered="true"] {
  transform: translateY(-2px);
}
```

## TypeScript Support

All components are fully typed with TypeScript:

```tsx
interface ReviewData {
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
  verified?: boolean
}

interface ReviewFormData {
  rating: number
  title: string
  content: string
  authorName: string
  authorEmail: string
  media: File[]
  termsAccepted: boolean
}
```

## Accessibility Features

- **ARIA Labels**: Automatic aria-label generation for ratings
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **Screen Reader Support**: Proper roles and landmarks
- **Focus Management**: Visible focus indicators
- **Error Announcements**: ARIA live regions for form errors

## Examples

### Basic Product Review Display
```tsx
function ProductReviews({ productId }: { productId: string }) {
  const { data, loading } = useReviews(productId)
  
  return (
    <ReviewsList data={data} loading={loading}>
      <ReviewsListHeader>
        <h2>Customer Reviews</h2>
        <ReviewsListStats />
      </ReviewsListHeader>
      
      <ReviewsListItems>
        {(reviews) => reviews.map(review => (
          <Card key={review.id} variant="outlined">
            <Review review={review}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ReviewAvatar />
                <div>
                  <ReviewAuthor />
                  <ReviewRating>
                    <RatingDisplay value={review.rating}>
                      <Stars />
                    </RatingDisplay>
                  </ReviewRating>
                </div>
              </div>
              <ReviewTitle />
              <ReviewContent />
              <ReviewDate />
            </Review>
          </Card>
        ))}
      </ReviewsListItems>
    </ReviewsList>
  )
}
```

### Review Submission Form
```tsx
function WriteReview({ productId }: { productId: string }) {
  const handleSubmit = async (data: ReviewFormData) => {
    await submitReview(productId, data)
  }
  
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <ReviewForm onSubmit={handleSubmit}>
          <ReviewFormField name="rating">
            <ReviewFormLabel>Overall Rating</ReviewFormLabel>
            <ReviewFormRatingInput name="rating" />
            <ReviewFormError name="rating" />
          </ReviewFormField>
          
          <ReviewFormField name="content">
            <ReviewFormLabel>Your Review</ReviewFormLabel>
            <ReviewFormTextarea name="content" rows={4} />
            <ReviewFormError name="content" />
          </ReviewFormField>
          
          <ReviewFormSubmit>Post Review</ReviewFormSubmit>
        </ReviewForm>
      </CardContent>
    </Card>
  )
}
```

This headless approach gives you complete control over styling while providing robust functionality, accessibility, and state management out of the box. 