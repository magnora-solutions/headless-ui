import { initMagnoraProvider, useMagnora } from '../magnora-provider'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('MagnoraProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the module to clear the singleton context
    jest.resetModules()
  })

  describe('initMagnoraProvider', () => {
    it('should initialize the provider with required options', () => {
      const { initMagnoraProvider } = require('../magnora-provider')
      
      expect(() => {
        initMagnoraProvider({
          apiKey: 'test-api-key',
          shopDomain: 'test-shop.myshopify.com'
        })
      }).not.toThrow()
    })

    it('should initialize the provider with only apiKey', () => {
      const { initMagnoraProvider } = require('../magnora-provider')
      
      expect(() => {
        initMagnoraProvider({
          apiKey: 'test-api-key'
        })
      }).not.toThrow()
    })
  })

  describe('useMagnora', () => {
    it('should throw error when provider is not initialized', () => {
      // Import fresh module instances
      const { useMagnora } = require('../magnora-provider')
      
      expect(() => {
        useMagnora()
      }).toThrow('MagnoraProvider has not been initialized')
    })

    it('should return context when provider is initialized', () => {
      // Import fresh module instances
      const { initMagnoraProvider, useMagnora } = require('../magnora-provider')
      
      initMagnoraProvider({
        apiKey: 'test-api-key',
        shopDomain: 'test-shop.myshopify.com'
      })

      const magnora = useMagnora()
      expect(magnora).toHaveProperty('apiKey', 'test-api-key')
      expect(magnora).toHaveProperty('shopDomain', 'test-shop.myshopify.com')
      expect(magnora).toHaveProperty('getRating')
      expect(typeof magnora.getRating).toBe('function')
    })
  })

  describe('getRating', () => {
    it('should make API call with correct parameters', async () => {
      const { initMagnoraProvider, useMagnora } = require('../magnora-provider')
      
      initMagnoraProvider({
        apiKey: 'test-api-key',
        shopDomain: 'test-shop.myshopify.com'
      })

      const mockResponse = {
        ok: true,
        json: async () => ({
          rating: 4.5,
          totalReviews: 120
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const magnora = useMagnora()
      const result = await magnora.getRating('test-product-123')

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/shopify/reviews?productId=test-product-123',
        {
          headers: {
            Authorization: 'Bearer test-api-key'
          }
        }
      )
      expect(result).toEqual({
        rating: 4.5,
        totalReviews: 120
      })
    })

    it('should throw error when API call fails', async () => {
      const { initMagnoraProvider, useMagnora } = require('../magnora-provider')
      
      initMagnoraProvider({
        apiKey: 'test-api-key'
      })

      const mockResponse = {
        ok: false
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const magnora = useMagnora()
      
      await expect(magnora.getRating('test-product-123')).rejects.toThrow('Failed to fetch rating')
    })

    it('should handle network errors', async () => {
      const { initMagnoraProvider, useMagnora } = require('../magnora-provider')
      
      initMagnoraProvider({
        apiKey: 'test-api-key'
      })

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const magnora = useMagnora()
      
      await expect(magnora.getRating('test-product-123')).rejects.toThrow('Network error')
    })
  })
})
