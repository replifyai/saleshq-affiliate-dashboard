# SalesHQ Affiliate Platform - Complete Feature Implementation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Authentication System](#authentication-system)
3. [User Onboarding Flow](#user-onboarding-flow)
4. [Dashboard Features](#dashboard-features)
5. [Orders Management](#orders-management)
6. [Products Management](#products-management)
7. [Profile Management](#profile-management)
8. [Commission System](#commission-system)
9. [Analytics & Reporting](#analytics--reporting)
10. [Social Media Integration](#social-media-integration)
11. [API Endpoints Specification](#api-endpoints-specification)
12. [Database Schema](#database-schema)
13. [Security Considerations](#security-considerations)
14. [Deployment Architecture](#deployment-architecture)

---

## Project Overview

**SalesHQ Affiliate Platform** is a comprehensive affiliate marketing management system built with Next.js 15, React 19, and TypeScript. The platform enables creators to join affiliate programs, track their performance, manage products, and earn commissions.

### Key Technologies
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4.x
- **Charts**: Chart.js with React-ChartJS-2
- **Animations**: GSAP
- **Icons**: Lucide React
- **State Management**: React Context API
- **Theme**: Custom theme system with dark-premium theme

---

## Authentication System

### Features
- **Mobile OTP Authentication**: Primary authentication method
- **Remember Me**: Optional session persistence
- **Social Login**: Facebook, LinkedIn, WhatsApp integration
- **Registration Flow**: New user signup with OTP verification

### Implementation Details

#### 1. Login Flow
```typescript
// API Endpoints Required
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/session
```

#### 2. Data Models
```typescript
interface AuthSession {
  id: string;
  userId: string;
  mobileNumber: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface OTPRecord {
  id: string;
  mobileNumber: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  isUsed: boolean;
  createdAt: Date;
}
```

#### 3. Authentication Flow
1. User enters mobile number
2. System sends 6-digit OTP via SMS
3. User enters OTP (30-second countdown for resend)
4. System verifies OTP and creates session
5. User is redirected to dashboard or onboarding

#### 4. Security Features
- OTP expiry: 5 minutes
- Maximum 3 OTP attempts
- Rate limiting: 5 OTP requests per hour per mobile
- Session management with JWT tokens
- CSRF protection

---

## User Onboarding Flow

### Features
- **3-Step Onboarding Process**
- **Creator Profile Setup**
- **Social Media Integration**
- **Category Selection**
- **Background Information**

### Implementation Details

#### 1. Onboarding Steps
```typescript
interface OnboardingData {
  creatorName: string;
  socialHandles: SocialMediaHandle[];
  background: string;
  categories: string[];
}

interface SocialMediaHandle {
  platform: string;
  handle: string;
  followers: string;
}
```

#### 2. Step-by-Step Process

**Step 1: Creator Name**
- Collect creator/affiliate name
- Validation: Required field, 2-50 characters
- Real-time validation feedback

**Step 2: Social Media Handles**
- Add multiple social media platforms
- Supported platforms: Instagram, YouTube, TikTok, Twitter, Facebook, LinkedIn
- Follower count tracking
- Handle validation per platform

**Step 3: Background & Categories**
- Background description (optional)
- Category selection (multiple choice)
- Categories: Technology, Fashion, Beauty, Fitness, Food, Travel, Gaming, Education, Business, Lifestyle, Health, Entertainment

#### 3. API Endpoints
```typescript
POST /api/onboarding/step1
POST /api/onboarding/step2
POST /api/onboarding/step3
POST /api/onboarding/complete
GET /api/onboarding/status
```

---

## Dashboard Features

### Features
- **Performance Statistics**
- **Share & Earn Section**
- **Analytics Overview**
- **Featured Products**
- **Real-time Tracking**

### Implementation Details

#### 1. Performance Statistics
```typescript
interface AffiliateStats {
  totalEarnings: number;
  monthlyEarnings: number;
  conversionRate: number;
  totalClicks: number;
  totalSales: number;
  nextPayout: number;
}
```

#### 2. Share & Earn Section
- **Referral Code Generation**: Unique affiliate codes
- **Social Media Sharing**: Facebook, LinkedIn, WhatsApp
- **Link Copying**: One-click copy functionality
- **QR Code Generation**: For easy sharing

#### 3. Analytics Overview
- **Chart Integration**: Chart.js for data visualization
- **Performance Trends**: 30-day performance data
- **Click Tracking**: Real-time click monitoring
- **Conversion Analytics**: Sales conversion metrics

#### 4. API Endpoints
```typescript
GET /api/dashboard/stats
GET /api/dashboard/analytics
GET /api/dashboard/featured-products
POST /api/dashboard/generate-referral-code
GET /api/dashboard/performance-trends
```

---

## Orders Management

### Features
- **Order Tracking**
- **Commission Calculation**
- **Payment Status Monitoring**
- **Channel Attribution**
- **Order History**

### Implementation Details

#### 1. Order Data Model
```typescript
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  orderValue: number;
  commission: number;
  commissionRate: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  channel: 'facebook' | 'instagram' | 'youtube' | 'coupon';
}
```

#### 2. Order Management Features
- **Order Status Tracking**: Real-time status updates
- **Commission Calculation**: Automatic commission computation
- **Payment Status**: Payment tracking and notifications
- **Channel Attribution**: Track which platform generated the sale
- **Order History**: Complete order history with search and filter

#### 3. Order Summary Cards
```typescript
interface OrderSummaryData {
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  averageOrderValue: number;
}
```

#### 4. API Endpoints
```typescript
GET /api/orders
GET /api/orders/:id
GET /api/orders/summary
PUT /api/orders/:id/status
GET /api/orders/channels
GET /api/orders/commission-history
```

---

## Products Management

### Features
- **Product Catalog**
- **Commission Management**
- **Performance Tracking**
- **Category Management**
- **Dynamic Insights**

### Implementation Details

#### 1. Product Data Model
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  commission: number;
  referralDiscount: number;
  performance: number;
  status: 'active' | 'paused' | 'inactive';
  image?: string;
  description?: string;
  lastUpdated: string;
  isFavorite?: boolean;
  recentSales?: number;
  salesGrowth?: number;
  affiliateLink?: string;
  salesData?: SalesDataPoint[];
}

interface SalesDataPoint {
  date: string;
  sales: number;
  clicks: number;
  conversions: number;
}
```

#### 2. Product Management Features
- **Product Catalog**: Browse and search products
- **Commission Tracking**: Track commission rates and earnings
- **Performance Analytics**: Sales performance metrics
- **Category Filtering**: Filter products by category
- **Favorites**: Mark products as favorites
- **Dynamic Commission**: Commission rates that change based on performance

#### 3. Product Categories
```typescript
interface Category {
  name: string;
  avgCommission: number;
  avgDiscount: number;
  topProduct: string;
  revenueShare: number;
  productCount: number;
}
```

#### 4. Product Modals
- **Product Detail Modal**: Detailed product information
- **Performance Chart Modal**: Visual performance data
- **Commission Calculator**: Real-time commission calculation

#### 5. API Endpoints
```typescript
GET /api/products
GET /api/products/:id
GET /api/products/categories
GET /api/products/performance/:id
POST /api/products/favorite/:id
GET /api/products/commission-rates
PUT /api/products/commission/:id
```

---

## Profile Management

### Features
- **Personal Information**
- **Social Media Profiles**
- **Account Statistics**
- **Profile Editing**

### Implementation Details

#### 1. Profile Data Model
```typescript
interface AffiliateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  bio: string;
  dateOfBirth: string;
  joiningDate: string;
  socialMedia: SocialMediaHandle[];
  commissionRate: number;
  totalEarnings: number;
  affiliateCode: string;
}

interface SocialMediaHandle {
  platform: string;
  handle: string;
  url: string;
  verified: boolean;
}
```

#### 2. Profile Sections
- **Personal Information**: Name, email, phone, location, bio
- **Social Media**: Multiple social media handles with verification status
- **Account Statistics**: Earnings, commission rate, joining date
- **Profile Header**: Avatar, name, edit functionality

#### 3. Profile Features
- **Edit Mode**: Toggle between view and edit modes
- **Social Media Management**: Add, edit, remove social handles
- **Profile Validation**: Real-time validation feedback
- **Avatar Upload**: Profile picture management

#### 4. API Endpoints
```typescript
GET /api/profile
PUT /api/profile
POST /api/profile/social-media
PUT /api/profile/social-media/:id
DELETE /api/profile/social-media/:id
POST /api/profile/avatar
GET /api/profile/statistics
```

---

## Commission System

### Features
- **Dynamic Commission Rates**
- **Commission Calculation**
- **Payout Management**
- **Commission History**

### Implementation Details

#### 1. Commission Calculation
```typescript
interface CommissionRule {
  id: string;
  productId: string;
  baseRate: number;
  tierRates: TierRate[];
  conditions: CommissionCondition[];
  isActive: boolean;
}

interface TierRate {
  minSales: number;
  maxSales: number;
  rate: number;
}

interface CommissionCondition {
  type: 'category' | 'channel' | 'timeframe' | 'performance';
  value: any;
  modifier: number;
}
```

#### 2. Commission Features
- **Dynamic Rates**: Commission rates that change based on performance
- **Tier System**: Higher rates for better performers
- **Category-based**: Different rates for different product categories
- **Channel-based**: Different rates for different marketing channels
- **Performance-based**: Rates adjusted based on conversion rates

#### 3. Payout System
```typescript
interface Payout {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduledDate: Date;
  processedDate?: Date;
  paymentMethod: 'bank_transfer' | 'upi' | 'wallet';
  transactionId?: string;
}
```

#### 4. API Endpoints
```typescript
GET /api/commission/rules
POST /api/commission/calculate
GET /api/commission/history
GET /api/payouts
POST /api/payouts/request
GET /api/payouts/schedule
```

---

## Analytics & Reporting

### Features
- **Performance Analytics**
- **Real-time Tracking**
- **Chart Visualizations**
- **Export Functionality**

### Implementation Details

#### 1. Analytics Data
```typescript
interface AnalyticsData {
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: ProductPerformance[];
  channelPerformance: ChannelPerformance[];
  timeSeriesData: TimeSeriesPoint[];
}

interface ProductPerformance {
  productId: string;
  productName: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
}

interface ChannelPerformance {
  channel: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}
```

#### 2. Chart Types
- **Line Charts**: Performance trends over time
- **Bar Charts**: Channel and product performance
- **Pie Charts**: Revenue distribution
- **Area Charts**: Cumulative performance

#### 3. Real-time Features
- **Live Tracking**: Real-time click and conversion tracking
- **WebSocket Updates**: Live data updates
- **Performance Alerts**: Notifications for significant changes

#### 4. API Endpoints
```typescript
GET /api/analytics/performance
GET /api/analytics/channels
GET /api/analytics/products
GET /api/analytics/time-series
GET /api/analytics/export
WebSocket /ws/analytics
```

---

## Social Media Integration

### Features
- **Social Media Sharing**
- **Platform Integration**
- **Follower Tracking**
- **Content Management**

### Implementation Details

#### 1. Supported Platforms
- **Facebook**: Share referral links
- **LinkedIn**: Professional sharing
- **WhatsApp**: Direct message sharing
- **Instagram**: Story and post sharing
- **YouTube**: Video descriptions
- **Twitter**: Tweet sharing

#### 2. Sharing Features
- **One-click Sharing**: Direct sharing to social platforms
- **Custom Messages**: Personalized sharing messages
- **Link Tracking**: Track clicks from social platforms
- **Analytics**: Social media performance metrics

#### 3. API Endpoints
```typescript
POST /api/social/share
GET /api/social/platforms
GET /api/social/analytics
POST /api/social/track-click
```

---

## API Endpoints Specification

### Authentication Endpoints
```typescript
// OTP Management
POST /api/auth/send-otp
Body: { mobileNumber: string }
Response: { success: boolean, message: string }

POST /api/auth/verify-otp
Body: { mobileNumber: string, otp: string }
Response: { success: boolean, token: string, user: User }

// Session Management
POST /api/auth/login
Body: { mobileNumber: string, rememberMe: boolean }
Response: { success: boolean, token: string, user: User }

POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }

GET /api/auth/session
Headers: { Authorization: Bearer <token> }
Response: { user: User, session: Session }
```

### User Management Endpoints
```typescript
// Profile Management
GET /api/profile
Headers: { Authorization: Bearer <token> }
Response: { profile: AffiliateProfile }

PUT /api/profile
Headers: { Authorization: Bearer <token> }
Body: { name: string, email: string, phone: string, ... }
Response: { success: boolean, profile: AffiliateProfile }

// Onboarding
POST /api/onboarding/step1
Body: { creatorName: string }
Response: { success: boolean }

POST /api/onboarding/step2
Body: { socialHandles: SocialMediaHandle[] }
Response: { success: boolean }

POST /api/onboarding/step3
Body: { background: string, categories: string[] }
Response: { success: boolean }

POST /api/onboarding/complete
Response: { success: boolean, redirectUrl: string }
```

### Dashboard Endpoints
```typescript
// Dashboard Data
GET /api/dashboard/stats
Headers: { Authorization: Bearer <token> }
Response: { stats: AffiliateStats }

GET /api/dashboard/analytics
Headers: { Authorization: Bearer <token> }
Response: { analytics: AnalyticsData }

GET /api/dashboard/featured-products
Headers: { Authorization: Bearer <token> }
Response: { products: Product[] }

// Referral Management
POST /api/dashboard/generate-referral-code
Headers: { Authorization: Bearer <token> }
Response: { referralCode: string, referralLink: string }

GET /api/dashboard/performance-trends
Headers: { Authorization: Bearer <token> }
Query: { period: '7d' | '30d' | '90d' }
Response: { trends: TimeSeriesPoint[] }
```

### Orders Endpoints
```typescript
// Order Management
GET /api/orders
Headers: { Authorization: Bearer <token> }
Query: { page: number, limit: number, status?: string, channel?: string }
Response: { orders: Order[], pagination: PaginationInfo }

GET /api/orders/:id
Headers: { Authorization: Bearer <token> }
Response: { order: Order }

GET /api/orders/summary
Headers: { Authorization: Bearer <token> }
Response: { summary: OrderSummaryData }

PUT /api/orders/:id/status
Headers: { Authorization: Bearer <token> }
Body: { status: string }
Response: { success: boolean }

GET /api/orders/channels
Headers: { Authorization: Bearer <token> }
Response: { channels: ChannelPerformance[] }

GET /api/orders/commission-history
Headers: { Authorization: Bearer <token> }
Response: { history: CommissionHistory[] }
```

### Products Endpoints
```typescript
// Product Management
GET /api/products
Headers: { Authorization: Bearer <token> }
Query: { category?: string, search?: string, sort?: string }
Response: { products: Product[], pagination: PaginationInfo }

GET /api/products/:id
Headers: { Authorization: Bearer <token> }
Response: { product: Product }

GET /api/products/categories
Headers: { Authorization: Bearer <token> }
Response: { categories: Category[] }

GET /api/products/performance/:id
Headers: { Authorization: Bearer <token> }
Response: { performance: ProductPerformance }

POST /api/products/favorite/:id
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }

GET /api/products/commission-rates
Headers: { Authorization: Bearer <token> }
Response: { rates: CommissionRule[] }

PUT /api/products/commission/:id
Headers: { Authorization: Bearer <token> }
Body: { rate: number }
Response: { success: boolean }
```

### Commission & Payout Endpoints
```typescript
// Commission Management
GET /api/commission/rules
Headers: { Authorization: Bearer <token> }
Response: { rules: CommissionRule[] }

POST /api/commission/calculate
Headers: { Authorization: Bearer <token> }
Body: { orderId: string }
Response: { commission: number, rate: number }

GET /api/commission/history
Headers: { Authorization: Bearer <token> }
Response: { history: CommissionHistory[] }

// Payout Management
GET /api/payouts
Headers: { Authorization: Bearer <token> }
Response: { payouts: Payout[] }

POST /api/payouts/request
Headers: { Authorization: Bearer <token> }
Body: { amount: number, paymentMethod: string }
Response: { success: boolean, payoutId: string }

GET /api/payouts/schedule
Headers: { Authorization: Bearer <token> }
Response: { schedule: PayoutSchedule[] }
```

### Analytics Endpoints
```typescript
// Analytics Data
GET /api/analytics/performance
Headers: { Authorization: Bearer <token> }
Query: { period: '7d' | '30d' | '90d' }
Response: { performance: AnalyticsData }

GET /api/analytics/channels
Headers: { Authorization: Bearer <token> }
Response: { channels: ChannelPerformance[] }

GET /api/analytics/products
Headers: { Authorization: Bearer <token> }
Response: { products: ProductPerformance[] }

GET /api/analytics/time-series
Headers: { Authorization: Bearer <token> }
Query: { period: '7d' | '30d' | '90d' }
Response: { timeSeries: TimeSeriesPoint[] }

GET /api/analytics/export
Headers: { Authorization: Bearer <token> }
Query: { format: 'csv' | 'excel' | 'pdf' }
Response: { fileUrl: string }

// WebSocket for Real-time Updates
WebSocket /ws/analytics
Headers: { Authorization: Bearer <token> }
Messages: { type: 'click' | 'conversion' | 'update', data: any }
```

### Social Media Endpoints
```typescript
// Social Media Integration
POST /api/social/share
Headers: { Authorization: Bearer <token> }
Body: { platform: string, content: string, link: string }
Response: { success: boolean, shareUrl: string }

GET /api/social/platforms
Headers: { Authorization: Bearer <token> }
Response: { platforms: SocialPlatform[] }

GET /api/social/analytics
Headers: { Authorization: Bearer <token> }
Response: { analytics: SocialAnalytics }

POST /api/social/track-click
Body: { platform: string, link: string, userId?: string }
Response: { success: boolean }
```

---

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    city VARCHAR(100),
    bio TEXT,
    date_of_birth DATE,
    joining_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    affiliate_code VARCHAR(20) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Social Media Handles Table
```sql
CREATE TABLE social_media_handles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    handle VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    followers_count VARCHAR(20),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    base_price DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    referral_discount DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active',
    affiliate_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(15),
    order_value DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    channel VARCHAR(50),
    affiliate_link VARCHAR(500),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Commission Rules Table
```sql
CREATE TABLE commission_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    rule_name VARCHAR(100) NOT NULL,
    base_rate DECIMAL(5,2) NOT NULL,
    tier_rules JSONB,
    conditions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Payouts Table
```sql
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    bank_details JSONB,
    scheduled_date TIMESTAMP,
    processed_date TIMESTAMP,
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Analytics Table
```sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'click', 'conversion', 'view'
    channel VARCHAR(50),
    affiliate_link VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### OTP Records Table
```sql
CREATE TABLE otp_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile_number VARCHAR(15) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    attempts INTEGER DEFAULT 0,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
```sql
-- Performance indexes
CREATE INDEX idx_users_mobile_number ON users(mobile_number);
CREATE INDEX idx_users_affiliate_code ON users(affiliate_code);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_channel ON orders(channel);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_otp_mobile_number ON otp_records(mobile_number);
CREATE INDEX idx_otp_expires_at ON otp_records(expires_at);
```

---

## Security Considerations

### Authentication Security
1. **OTP Security**
   - 6-digit numeric OTP
   - 5-minute expiry
   - Maximum 3 attempts
   - Rate limiting: 5 requests per hour per mobile

2. **Session Management**
   - JWT tokens with short expiry
   - Refresh token mechanism
   - Session invalidation on logout
   - Concurrent session limits

3. **Data Protection**
   - Password hashing (bcrypt)
   - Sensitive data encryption
   - HTTPS enforcement
   - CORS configuration

### API Security
1. **Rate Limiting**
   - Per-user rate limits
   - Per-endpoint rate limits
   - IP-based rate limiting
   - DDoS protection

2. **Input Validation**
   - Request body validation
   - SQL injection prevention
   - XSS protection
   - CSRF tokens

3. **Authorization**
   - Role-based access control
   - Resource-level permissions
   - API key management
   - Audit logging

### Data Security
1. **Encryption**
   - Data at rest encryption
   - Data in transit encryption
   - Key management
   - Backup encryption

2. **Privacy**
   - GDPR compliance
   - Data anonymization
   - Right to deletion
   - Data portability

---

## Deployment Architecture

### Frontend Deployment
1. **Next.js Application**
   - Static site generation (SSG)
   - Server-side rendering (SSR)
   - API routes for backend integration
   - CDN distribution

2. **Hosting Options**
   - Vercel (recommended)
   - Netlify
   - AWS Amplify
   - Custom VPS

### Backend Deployment
1. **API Server**
   - Node.js/Express.js
   - TypeScript
   - RESTful API design
   - GraphQL (optional)

2. **Database**
   - PostgreSQL (recommended)
   - Redis for caching
   - Database clustering
   - Backup strategies

3. **Infrastructure**
   - Docker containerization
   - Kubernetes orchestration
   - Load balancing
   - Auto-scaling

### Monitoring & Logging
1. **Application Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring
   - User analytics

2. **Logging**
   - Structured logging
   - Log aggregation
   - Real-time monitoring
   - Alert systems

### CI/CD Pipeline
1. **Development Workflow**
   - Git branching strategy
   - Code reviews
   - Automated testing
   - Quality gates

2. **Deployment Pipeline**
   - Automated builds
   - Testing automation
   - Staging environment
   - Production deployment

---

## Implementation Timeline

### Phase 1: Core Infrastructure (Weeks 1-2)
- [ ] Database setup and schema creation
- [ ] Authentication system implementation
- [ ] Basic API endpoints
- [ ] Frontend authentication flow

### Phase 2: User Management (Weeks 3-4)
- [ ] User onboarding flow
- [ ] Profile management
- [ ] Social media integration
- [ ] Dashboard implementation

### Phase 3: Product & Order Management (Weeks 5-6)
- [ ] Product catalog system
- [ ] Order management
- [ ] Commission calculation
- [ ] Payment integration

### Phase 4: Analytics & Reporting (Weeks 7-8)
- [ ] Analytics implementation
- [ ] Chart integration
- [ ] Reporting features
- [ ] Export functionality

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] Real-time tracking
- [ ] Social media sharing
- [ ] Advanced analytics
- [ ] Performance optimization

### Phase 6: Testing & Deployment (Weeks 11-12)
- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Production deployment

---

## Conclusion

This comprehensive feature implementation guide provides all the necessary details for building the SalesHQ Affiliate Platform backend. The system is designed to be scalable, secure, and feature-rich, supporting the complete affiliate marketing workflow from user registration to commission payouts.

Key success factors:
1. **Modular Architecture**: Each feature is independently implementable
2. **Scalable Design**: Database and API design supports growth
3. **Security First**: Comprehensive security measures throughout
4. **User Experience**: Intuitive workflows and real-time feedback
5. **Analytics Driven**: Rich analytics for performance optimization

The implementation should follow the phased approach outlined above, ensuring each component is thoroughly tested before moving to the next phase.
