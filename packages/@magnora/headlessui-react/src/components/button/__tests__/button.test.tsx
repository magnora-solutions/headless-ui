import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards standard button props', () => {
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick} disabled>
        Test Button
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has React Aria interaction props', () => {
    const onHoverStart = jest.fn()
    const onHoverEnd = jest.fn()
    const onPress = jest.fn()
    
    render(
      <Button 
        onHoverStart={onHoverStart} 
        onHoverEnd={onHoverEnd}
        onPress={onPress}
      >
        Interactive Button
      </Button>
    )
    
    const button = screen.getByRole('button')
    
    // Check that React Aria props are properly applied
    expect(button).toHaveAttribute('data-hovered', 'false')
    expect(button).toHaveAttribute('data-pressed', 'false')
    expect(button).toHaveAttribute('data-focused', 'false')
    
    // Verify the component has the correct data attributes for styling
    expect(button).toHaveAttribute('data-variant', 'primary')
    expect(button).toHaveAttribute('data-size', 'md')
    expect(button).toHaveAttribute('data-disabled', 'false')
  })

  it('supports different variants', () => {
    render(<Button variant="danger">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'danger')
  })

  it('supports different sizes', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('handles loading state', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-loading', 'true')
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('renders with left and right icons', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">←</span>} rightIcon={<span data-testid="right-icon">→</span>}>
        Button with icons
      </Button>
    )
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('has proper focus states', async () => {
    const user = userEvent.setup()
    render(<Button>Focus me</Button>)
    
    const button = screen.getByRole('button')
    
    // Initial state
    expect(button).toHaveAttribute('data-focused', 'false')
    
    // Focus state
    await user.tab()
    expect(button).toHaveAttribute('data-focused', 'true')
    
    // Blur state
    await user.tab()
    expect(button).toHaveAttribute('data-focused', 'false')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('provides button state through data attributes', () => {
    render(<Button variant="primary" size="md">Test</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('data-variant', 'primary')
    expect(button).toHaveAttribute('data-size', 'md')
    expect(button).toHaveAttribute('data-disabled', 'false')
    expect(button).toHaveAttribute('data-loading', 'false')
  })
})
