# Magnora Reviews - Project Restructure Plan

Based on the call with Mriganka, we need to transform from a headless UI library to a comprehensive Shopify app ecosystem.

## 📁 New Project Structure

```
magnora-reviews/
├── apps/
│   ├── shopify-admin/              # Shopify Admin App
│   │   ├── app/
│   │   │   ├── routes/
│   │   │   │   ├── app.index.tsx   # Index tab - "Welcome to Channel"
│   │   │   │   └── app.reviews.tsx # Reviews tab - List & CSV import
│   │   │   └── components/
│   │   ├── extensions/
│   │   │   ├── product-reviews-block/    # Admin Block for Product page
│   │   │   └── customer-reviews-block/   # Admin Block for Customer page
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   └── api/                        # Backend API
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   └── utils/
│       └── package.json
├── packages/
│   ├── @magnora/
│   │   ├── headless-react/         # Enhanced headless components
│   │   │   ├── src/
│   │   │   │   ├── components/
│   │   │   │   │   ├── rating/           # ✅ Already built
│   │   │   │   │   ├── review/           # ✅ Already built  
│   │   │   │   │   ├── review-list/      # ✅ Already built
│   │   │   │   │   ├── review-form/      # ✅ Already built
│   │   │   │   │   ├── card-review/      # 🆕 New requirement
│   │   │   │   │   └── pagination/       # 🆕 New requirement
│   │   │   │   ├── providers/
│   │   │   │   │   ├── shopify-provider.tsx  # 🆕 Shopify integration
│   │   │   │   │   └── magnora-provider.tsx  # ✅ Already built
│   │   │   │   └── hooks/
│   │   │   │       ├── useShopifyReviews.ts  # 🆕 Data fetching
│   │   │   │       └── usePagination.ts      # 🆕 Pagination logic
│   │   │   └── package.json
│   │   └── ui-components/          # Internal reusable components
│   └── shared/                     # Shared utilities
│       ├── types/
│       ├── utils/
│       └── constants/
└── docs/
    ├── getting-started.md
    ├── shopify-integration.md
    └── component-library.md
```

## 🎯 Development Phases

### Phase 1: Shopify Admin App Foundation
1. **Create Shopify App structure** using Shopify CLI
2. **Implement Navigation Tabs:**
   - Index tab: "Welcome to Channel"
   - Reviews tab: List view + CSV import UI
3. **Setup Prisma database** with review schema
4. **Add required Shopify scopes** (read_products, etc.)

### Phase 2: Admin Block Extensions  
1. **Product Reviews Block:**
   - Display reviews for specific product
   - GraphQL queries to fetch product data
   - Embed in Product Details page
2. **Customer Reviews Block:**
   - Show reviews by specific customer
   - Display product details for each review
   - Embed in Customer Details page

### Phase 3: Enhanced Headless Components
1. **Shopify Provider Context:**
   - Handle Shop ID and Product ID
   - Data caching and state management
   - API integration for non-Hydrogen stores
2. **New Components:**
   - Card Review component
   - Pagination component
   - Customizable star symbols
3. **Modular Form Architecture:**
   - Separate field components
   - Form handler component
   - Validation logic

### Phase 4: Backend API & Integration
1. **API endpoints** for headless components
2. **Webhook handlers** for Shopify data sync
3. **Database as Source of Truth** migration
4. **Authorization & billing** integration

## 🔧 Technical Requirements

### Shopify Admin App
- **Framework**: Remix + Polaris UI
- **Extensions**: Admin UI Extensions
- **Database**: Prisma + PostgreSQL
- **Scopes**: `read_products`, `read_customers`, `write_products`

### Headless Components  
- **Framework**: React 18+ with TypeScript
- **Accessibility**: React Aria (already implemented)
- **Styling**: Headless with data attributes
- **Bundle**: <100KB total
- **SSR**: Server Component compatible

### Backend API
- **Framework**: Node.js + Express/Fastify
- **Database**: Prisma ORM
- **Auth**: Shopify OAuth + JWT
- **Caching**: Redis for performance

## 📋 Immediate Action Items

1. **Setup monorepo structure** with proper workspaces
2. **Create Shopify app** using `shopify app create`
3. **Move existing headless components** to new structure
4. **Implement Shopify Provider** for plug-and-play architecture
5. **Create admin navigation tabs** with basic UI
6. **Setup admin block extensions** templates

## 🎨 Component Architecture Changes

### Before (Current)
```jsx
<MagnoraProvider config={{ apiKey, shopDomain }}>
  <Rating value={4} onChange={setValue} />
</MagnoraProvider>
```

### After (New Requirements)
```jsx
// For Hydrogen stores (auto-detects shop)
<ShopifyProvider>
  <ProductReviews productId="gid://shopify/Product/123" />
</ShopifyProvider>

// For non-Hydrogen stores  
<ShopifyProvider shopId="shop.myshopify.com">
  <ProductReviews productId="gid://shopify/Product/123" />
</ShopifyProvider>

// Individual components (modular)
<ReviewsList productId="gid://shopify/Product/123">
  <RatingDisplay />
  <ReviewList>
    <Pagination />
  </ReviewList>
  <CardReview />
</ReviewsList>
```

## 🚀 Success Metrics

- **"Build for Shopify" certification** ready
- **Plug-and-play integration** (zero API coding needed)
- **Admin extensions** functional in Shopify admin
- **CSV import** working for bulk reviews
- **Performance**: <100KB bundle, <200ms API response
- **Accessibility**: WCAG 2.1 AA compliant

## 📅 Timeline Estimate

- **Week 1**: Project restructure + Shopify app setup
- **Week 2**: Admin tabs + basic extensions
- **Week 3**: Enhanced headless components + Shopify integration  
- **Week 4**: Backend API + database integration
- **Week 5**: Testing + polish + documentation

This restructure maintains all the excellent work done on the headless components while expanding into a full Shopify ecosystem solution. 