# Backend API Usage Documentation

This document outlines the backend API endpoints used in the application, detailing the response fields that are currently utilized by the frontend and those that are available but unused.

## 1. Creator Profile

### Endpoint: `GET /creator/profile`
**Description:** Fetches the logged-in creator's profile and completion score.

**Response Interface:** `GetCreatorProfileResponse`

| Field | Status | Notes |
|-------|--------|-------|
| `creator.id` | ✅ Used | |
| `creator.name` | ✅ Used | |
| `creator.phoneNumber` | ✅ Used | |
| `creator.email` | ✅ Used | |
| `creator.createdAt` | ✅ Used | |
| `creator.approved` | ✅ Used | |
| `creator.socialMediaHandles` | ✅ Used | |
| `creator.phoneNumberVerified` | ✅ Used | |
| `creator.uniqueReferralCode` | ✅ Used | |
| `creator.completionScore` | ✅ Used | Used to track profile completeness. |

---

## 2. Authentication (OTP)

### Endpoint: `POST /creator/send-otp`
**Description:** Sends an OTP to the provided phone number.

**Response Interface:** `SendOtpResponse`

| Field | Status | Notes |
|-------|--------|-------|
| `success` | ✅ Used | Implicitly checked. |
| `message` | ✅ Used | Available for error/success messages. |

### Endpoint: `POST /creator/verify-otp`
**Description:** Verifies the OTP and logs the user in.

**Response Interface:** `VerifyOtpResponse`

| Field | Status | Notes |
|-------|--------|-------|
| `verified.idToken` | ✅ Used | For authentication. |
| `verified.refreshToken` | ✅ Used | For token refresh. |
| `verified.completionScore` | ✅ Used | |
| `verified.profile` | ✅ Used | Complete profile object. |

---

## 3. Creator Coupons

### Endpoint: `GET /creator/coupons`
**Description:** Fetches all coupons created by the creator.

**Response Interface:** `GetCreatorCouponsResponse` -> `coupons` (Array of `Coupon`)

| Field | Status | Notes |
|-------|--------|-------|
| `id` | ✅ Used | |
| `title` | ✅ Used | Displayed in Coupon Card. |
| `code` | ✅ Used | Displayed in Coupon Card. |
| `status` | ✅ Used | Used for sorting and badge (`PENDING`, `ACTIVE`, etc.). |
| `value` | ✅ Used | `amount` / `percentage`, `currencyCode`, `appliesOnEachItem`. |
| `usageLimit` | ✅ Used | Displayed in Coupon Card. |
| `startsAt` | ✅ Used | Displayed in Coupon Card. |
| `endsAt` | ✅ Used | Displayed in Coupon Card. |
| `description` | ✅ Used | Displayed in Coupon Card. |
| `createdAt` | ✅ Used | Used for sorting. |
| `shopifyId` | ❌ Unused | |
| `usesPerOrderLimit` | ❌ Unused | Not displayed in card, only sent during creation. |
| `itemsSelection` | ❌ Unused | |
| `createdBy` | ❌ Unused | |
| `approvedBy` | ❌ Unused | |
| `approvedAt` | ❌ Unused | |
| `updatedAt` | ❌ Unused | |

### Endpoint: `POST /creator/coupons`
**Description:** Creates a new coupon.
**Usage:** The response returns the created coupon, which is implicitly used to confirm success, though the UI immediately triggers a refetch of the list.

---

## 4. Creator Orders

### Endpoint: `POST /creator/orders`
**Description:** Fetches a paginated list of orders attributed to the creator.

**Response Interface:** `GetCreatorOrdersResponse` -> `orders` (Array of `CreatorOrder`)

| Field | Status | Notes |
|-------|--------|-------|
| `id` | ✅ Used | |
| `orderNumber` | ✅ Used | |
| `totalAmount` | ✅ Used | Order Value. |
| `commissionAmount` | ✅ Used | |
| `commissionRateValue` | ✅ Used | Displayed in Order Details. |
| `commissionBasis` | ✅ Used | Displayed in Order Details (e.g. "% on Total"). |
| `discountsTotal` | ✅ Used | |
| `lineItems` | ✅ Used | Used for product names and details in modal. |
| `attributionType` | ✅ Used | Determines "Channel" (Coupon, Link, etc.). |
| `commissionSource` | ✅ Used | Fallback for attribution type. |
| `paymentStatus` | ✅ Used | `paid`, `pending`, `failed`, `refunded`. |
| `rawEvent` | ✅ Used | Accessing `customer` (name) and `shipping_address` (city, country). |
| `customerEmail` | ✅ Used | Fallback for customer name. |
| `attributedCouponCode` | ✅ Used | |
| `appliedCoupons` | ✅ Used | |
| `createdAt` | ✅ Used | Order Date. |
| `currencyCode` | ✅ Used | For currency formatting. |
| `refundedAmount` | ✅ Used | Displayed if refund exists. |
| `refundReason` | ✅ Used | Displayed if refund exists. |
| `checkoutToken` | ❌ Unused | |
| `pixelEventId` | ❌ Unused | |
| `customerId` | ❌ Unused | |
| `subtotalAmount` | ❌ Unused | |
| `shippingAmount` | ❌ Unused | |
| `taxAmount` | ❌ Unused | |
| `commissionRateType` | ❌ Unused | |
| `commissionCurrency` | ❌ Unused | |
| `updatedAt` | ❌ Unused | |

---

## 5. Dashboard Summary

### Endpoint: `POST /creator/dashboard-summary`
**Description:** Fetches summary statistics for the dashboard.

**Response Interface:** `GetCreatorDashboardSummaryResponse` -> `summary`

| Field | Status | Notes |
|-------|--------|-------|
| `totalSales` | ✅ Used | displayed as "Your Sales". |
| `totalOrders` | ✅ Used | displayed as "Total Orders". |
| `totalCommission` | ✅ Used | displayed as "Commission on Sales". |
| `paidEarnings` | ✅ Used | displayed as "Payouts Issued". |
| `pendingEarnings` | ✅ Used | displayed as "Next Payout". |
| `earningsStatusMap` | ✅ Used | `upcoming_payment.count` used for next payout date/count. |
| `averageOrderValue` | ❌ Unused | Calculated client-side in Orders Page if needed. |
| `totalDiscountsGiven` | ❌ Unused | |
| `totalEarnings` | ❌ Unused | |
| `salesBySocialChannel` | ❌ Unused | |
| `activeCoupon` | ❌ Unused | |
| `referralLink` | ❌ Unused | |
| `totalEarningsTillDate` | ❌ Unused | Legacy field. |
| `averageEarningPerOrder`| ❌ Unused | Legacy field. |

---

## 6. Shopify Products

### Endpoint: `GET (External) /getAllShopifyProducts` & `POST (External) /getShopifyProductsByIds`
**Description:** Fetches products from Shopify.

**Response Interface:** `GetShopifyProductsResponse` -> `data` (Array of `ShopifyProduct`)

| Field | Status | Notes |
|-------|--------|-------|
| `id` | ✅ Used | |
| `title` | ✅ Used | Mapped to `name`. |
| `handle` | ✅ Used | Used for share links. |
| `productType` | ✅ Used | Mapped to `category`. |
| `status` | ✅ Used | |
| `images` | ✅ Used | Displayed in Product Card. |

---

## 7. Product Collections

### Endpoint: `GET (External) /getAllProductCollectionsForCreator`
**Description:** Fetches product collections.

**Response Interface:** `GetProductCollectionsResponse` -> `productCollections` (Array of `ProductCollection`)

| Field | Status | Notes |
|-------|--------|-------|
| `id` | ✅ Used | |
| `name` | ✅ Used | |
| `handle` | ✅ Used | Used for share links. |
| `productIds` | ✅ Used | Used to fetch products in a collection. |
| `description` | ❌ Unused | |
| `createdAt` | ❌ Unused | |
| `updatedAt` | ❌ Unused | |
| `createdBy` | ❌ Unused | |
