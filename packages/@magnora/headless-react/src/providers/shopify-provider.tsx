import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types for Shopify integration
export interface ShopifyConfig {
  shopId?: string;
  apiUrl?: string;
  apiKey?: string;
  environment?: 'production' | 'development';
}

export interface ShopifyReview {
  id: string;
  productId: string;
  customerId?: string;
  author: string;
  title: string;
  content: string;
  rating: number;
  date: string;
  verified: boolean;
  helpful: number;
  media?: string[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  averageRating: number;
  reviewCount: number;
}

export interface ShopifyShop {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface ShopifyContextType {
  config: ShopifyConfig;
  isHydrogenStore: boolean;
  shopId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Data fetching methods
  getReviews: (productId: string, options?: GetReviewsOptions) => Promise<ShopifyReview[]>;
  getProduct: (productId: string) => Promise<ShopifyProduct>;
  getShop: () => Promise<ShopifyShop>;
  getCurrentProductId: () => string | null;
  submitReview: (review: Partial<ShopifyReview>) => Promise<ShopifyReview>;
  
  // Cache management
  clearCache: () => void;
  refreshReviews: (productId: string) => Promise<void>;
}

interface GetReviewsOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}

const ShopifyContext = createContext<ShopifyContextType | null>(null);

// Cache for reviews and products
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Auto-detect if running in Shopify Hydrogen
function detectHydrogenEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  const globalAny = window as any;

  return Boolean(
    globalAny.Shopify?.shop ||
    globalAny.__HYDROGEN__ ||
    globalAny.__HYDROGEN_DEV__ ||
    globalAny.__HYDROGEN_SERVER__ ||
    document.querySelector('meta[name="shopify-shop-id"]') ||
    document.querySelector('meta[name="hydrogen-shop-id"]')
  );
}

// Extract shop ID from various sources
function extractShopId(): string | null {
  if (typeof window === 'undefined') return null;

  // Try Hydrogen globals
  if ((window as any).Shopify?.shop) {
    return (window as any).Shopify.shop;
  }

  // Try meta tags
  const metaTag =
    document.querySelector('meta[name="shopify-shop-id"]') ||
    document.querySelector('meta[name="hydrogen-shop-id"]');
  if (metaTag) {
    return metaTag.getAttribute('content');
  }

  // Try URL pattern detection
  const hostname = window.location.hostname;
  if (hostname.includes('.myshopify.com')) {
    return hostname.split('.')[0] + '.myshopify.com';
  }

  return null;
}

// Cache utilities
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

interface ShopifyProviderProps {
  children: ReactNode;
  config?: ShopifyConfig;
}

export function ShopifyProvider({ children, config = {} }: ShopifyProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const [isHydrogenStore, setIsHydrogenStore] = useState(false);

  // Initialize provider
  useEffect(() => {
    try {
      const isHydrogen = detectHydrogenEnvironment();
      setIsHydrogenStore(isHydrogen);

      let detectedShopId = config.shopId || extractShopId();
      
      if (!detectedShopId && !isHydrogen) {
        console.warn(
          'ShopifyProvider: No shop ID detected. Please provide shopId prop for non-Hydrogen stores.'
        );
      }

      setShopId(detectedShopId);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Shopify provider');
      setIsLoading(false);
    }
  }, [config.shopId]);

  // API methods
  const getReviews = async (
    productId: string, 
    options: GetReviewsOptions = {}
  ): Promise<ShopifyReview[]> => {
    const cacheKey = `reviews-${productId}-${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = getCachedData<ShopifyReview[]>(cacheKey);
    if (cached) return cached;

    try {
      const apiUrl = config.apiUrl || '/api/reviews';
      const queryParams = new URLSearchParams();
      queryParams.set('productId', productId);
      queryParams.set('shopId', shopId || '');
      
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.set(key, String(value));
        }
      });

      const response = await fetch(`${apiUrl}?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      const reviews = await response.json();
      setCachedData(cacheKey, reviews);
      return reviews;
    } catch (err) {
      console.error('Error fetching reviews:', err);
      throw err;
    }
  };

  const getProduct = async (productId: string): Promise<ShopifyProduct> => {
    const cacheKey = `product-${productId}`;
    
    const cached = getCachedData<ShopifyProduct>(cacheKey);
    if (cached) return cached;

    try {
      const apiUrl = config.apiUrl || '/api/products';
      const response = await fetch(`${apiUrl}/${productId}?shopId=${shopId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const product = await response.json();
      setCachedData(cacheKey, product);
      return product;
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  };

  const getShop = async (): Promise<ShopifyShop> => {
    const cacheKey = 'shop-info';
    const cached = getCachedData<ShopifyShop>(cacheKey);
    if (cached) return cached;

    try {
      const apiUrl = config.apiUrl || '/api/shop';
      const response = await fetch(`${apiUrl}?shopId=${shopId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch shop info: ${response.statusText}`);
      }

      const shop = await response.json();
      setCachedData(cacheKey, shop);
      return shop;
    } catch (err) {
      console.error('Error fetching shop info:', err);
      throw err;
    }
  };

  const getCurrentProductId = (): string | null => {
    if (typeof window === 'undefined') return null;
    const meta = document.querySelector('meta[name="shopify-product-id"]');
    if (meta) return meta.getAttribute('content');
    const el = document.querySelector('[data-product-id]');
    return el ? el.getAttribute('data-product-id') : null;
  };

  const submitReview = async (review: Partial<ShopifyReview>): Promise<ShopifyReview> => {
    try {
      const apiUrl = config.apiUrl || '/api/reviews';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
        },
        body: JSON.stringify({
          ...review,
          shopId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.statusText}`);
      }

      const newReview = await response.json();
      
      // Invalidate related cache entries
      for (const [key] of cache.entries()) {
        if (key.includes(`reviews-${review.productId}`)) {
          cache.delete(key);
        }
      }

      return newReview;
    } catch (err) {
      console.error('Error submitting review:', err);
      throw err;
    }
  };

  const clearCache = () => {
    cache.clear();
  };

  const refreshReviews = async (productId: string) => {
    // Clear cache for this product
    for (const [key] of cache.entries()) {
      if (key.includes(`reviews-${productId}`)) {
        cache.delete(key);
      }
    }
    
    // Fetch fresh data
    await getReviews(productId);
  };

  const contextValue: ShopifyContextType = {
    config,
    isHydrogenStore,
    shopId,
    isLoading,
    error,
    getReviews,
    getProduct,
    getShop,
    getCurrentProductId,
    submitReview,
    clearCache,
    refreshReviews,
  };

  if (error) {
    console.error('ShopifyProvider error:', error);
  }

  return (
    <ShopifyContext.Provider value={contextValue}>
      {children}
    </ShopifyContext.Provider>
  );
}

// Hook to use Shopify context
export function useShopify(): ShopifyContextType {
  const context = useContext(ShopifyContext);
  
  if (!context) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  
  return context;
}

export function useShopifyShop() {
  const { getShop } = useShopify();
  const [shop, setShop] = useState<ShopifyShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getShop()
      .then(setShop)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [getShop]);

  return { shop, isLoading, error };
}

export function useCurrentProductId() {
  const { getCurrentProductId } = useShopify();
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    setProductId(getCurrentProductId());
  }, [getCurrentProductId]);

  return productId;
}

// Hook for fetching reviews with automatic loading states
export function useShopifyReviews(productId: string, options?: GetReviewsOptions) {
  const { getReviews } = useShopify();
  const [reviews, setReviews] = useState<ShopifyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    getReviews(productId, options)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [productId, getReviews, JSON.stringify(options)]);

  return { reviews, isLoading, error, refetch: () => getReviews(productId, options) };
}

// Hook for fetching product data
export function useShopifyProduct(productId: string) {
  const { getProduct } = useShopify();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    getProduct(productId)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [productId, getProduct]);

  return { product, isLoading, error };
} 