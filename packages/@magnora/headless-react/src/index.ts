// Core providers
export * from './providers/magnora-provider';
export * from './providers/shopify-provider';
export { useShopifyShop, useCurrentProductId } from './providers/shopify-provider';

// Rating components
export * from './components/rating/rating';

// Review components
export * from './components/review/review';

// Review form components  
export * from './components/review-form/review-form';

// Reviews list components
export * from './components/reviews-list/reviews-list';

// Card layout components
export * from './components/card/card';

// Button components
export * from './components/button/button';

// New Shopify-specific components
export * from './components/card-review/card-review';
export * from './components/pagination/pagination';

// Re-export types for convenience
export type {
  ShopifyConfig,
  ShopifyReview,
  ShopifyProduct,
  ShopifyShop,
} from './providers/shopify-provider';
