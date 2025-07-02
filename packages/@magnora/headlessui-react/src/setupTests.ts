import '@testing-library/jest-dom'

// Mock fetch for testing
Object.defineProperty(global, 'fetch', {
  value: jest.fn(),
  writable: true,
})

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks()
})
