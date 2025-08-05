# Enhanced API Endpoints Reference for Naafe' MVP

This document details all RESTful API endpoints needed for the Naafe' job-market platform MVP. Each endpoint lists:

* **Method**
* **Path**
* **Description**
* **Authentication Required**
* **Input** (body or query parameters)
* **Output** (response schema summary)
* **Notes** (special behaviors, caching, role restrictions)

---

## 1. Authentication & Security

| Method | Path                        | Description              | Auth? | Input                                                        | Output                                          | Notes                                          |
| ------ | --------------------------- | ------------------------ | ----- | ------------------------------------------------------------ | ----------------------------------------------- | ---------------------------------------------- |
| POST   | `/api/auth/register`        | Register a new user      | No    | JSON `{ email, password, name: {first, last}, phone, role }` | `{ user: { _id, email, role, name }, message }` | Sends OTP to phone/email for verification      |
| POST   | `/api/auth/login`           | User login               | No    | JSON `{ email, password }`                                   | `{ token, refreshToken, user }`                 | JWT expiration: 1h; refresh token valid for 7d |
| POST   | `/api/auth/logout`          | User logout              | Yes   | —                                                            | `{ success }`                                   | Invalidates current token                      |
| POST   | `/api/auth/verify-otp`      | Verify user's OTP        | No    | JSON `{ userId, otp }`                                       | `{ success, message }`                          | Sets `trust.isVerified=true`, `verifiedAt`     |
| POST   | `/api/auth/refresh`         | Refresh JWT token        | No    | JSON `{ refreshToken }`                                      | `{ token }`                                     | Invalidates old token                          |
| POST   | `/api/auth/forgot-password` | Request password reset   | No    | JSON `{ email }`                                             | `{ message }`                                   | Sends reset link or OTP                        |
| POST   | `/api/auth/reset-password`  | Reset forgotten password | No    | JSON `{ token, newPassword }`                                | `{ success, message }`                          | Consumes OTP or reset token                    |
| POST   | `/api/auth/change-password` | Change current password  | Yes   | JSON `{ currentPassword, newPassword }`                      | `{ success, message }`                          | Requires current password verification          |
| POST   | `/api/auth/resend-otp`      | Resend verification OTP  | Yes   | JSON `{ userId }`                                            | `{ message }`                                   | Rate-limit to prevent abuse                    |

---

## 2. User Profiles

| Method | Path                         | Description                        | Auth? | Input                                                                      | Output             | Notes                                              |
| ------ | ---------------------------- | ---------------------------------- | ----- | -------------------------------------------------------------------------- | ------------------ | -------------------------------------------------- |
| GET    | `/api/users/me`              | Get current user profile           | Yes   | —                                                                          | `{ user }`         | Populates `subscription`, `loyaltyPoints`, `trust` |
| PATCH  | `/api/users/me`              | Update own profile                 | Yes   | Partial JSON `{ name?, phone?, avatarUrl?, profile: { bio?, location? } }` | `{ user }`         | GeoJSON for `profile.location`                     |
| GET    | `/api/users/:id`             | Get public user profile            | Yes   | —                                                                          | `{ userPublic }`   | Excludes sensitive fields (`email`, `password`)    |
| PATCH  | `/api/users/me/subscription` | Change or extend subscription tier | Yes   | JSON `{ tier, expiresAt }`                                                 | `{ subscription }` | Admin or payment webhook only                      |
| GET    | `/api/admin/users`           | List all users (admin only)        | Yes   | Query `?role=seeker&provider&admin&page&limit`                             | `{ users[], totalCount }` | Requires `role=admin`                              |
| PATCH  | `/api/admin/users/:id/block` | Block/unblock user (admin only)    | Yes   | JSON `{ isBlocked, reason? }`                                              | `{ success }`      | Requires `role=admin`                              |
| GET    | `/api/users/:id/portfolio`   | Get user portfolio (providers)     | No    | —                                                                          | `{ portfolio[] }`  | Only for providers                                |

---

## 3. Taxonomy (Categories & Tags)

| Method | Path              | Description           | Auth?       | Input                      | Output             | Notes               |
| ------ | ----------------- | --------------------- | ----------- | -------------------------- | ------------------ | ------------------- |
| GET    | `/api/categories` | List all categories   | No          | —                          | `{ categories[] }` | For dropdown menus  |
| POST   | `/api/categories` | Create a new category | Yes (admin) | JSON `{ name, parentId? }` | `{ category }`     | Maintains hierarchy |
| PUT    | `/api/categories/:id` | Update category    | Yes (admin) | JSON `{ name, description, icon, order }` | `{ category }` | Maintains hierarchy |
| DELETE | `/api/categories/:id` | Delete category   | Yes (admin) | —                          | `{ success }`      | Only if no children |
| GET    | `/api/tags`       | List all tags         | No          | —                          | `{ tags[] }`       | For autocomplete    |

---

## 4. Job Requests

| Method | Path                                | Description                       | Auth? | Input                                                                                           | Output                       | Notes                                                           |
| ------ | ----------------------------------- | --------------------------------- | ----- | ----------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| POST   | `/api/requests`                     | Create a new job request          | Yes   | JSON `{ title, description, category, budget: { min, max }, location: GeoJSON, deadline, attachments[] }` | `{ jobRequest }`             | Default `status=open`                                           |
| GET    | `/api/requests`                     | Search/List job requests          | No    | Query `?category=&status=&lat=&lng=&radius=&minBudget=&maxBudget=&page=&limit=&search=&urgent=`         | `{ requests[], totalCount }` | Geo-filters use `2dsphere` index                                |
| GET    | `/api/requests/:id`                 | Get single job details            | No    | —                                                                                               | `{ jobRequest }`             | Populates `seeker` and virtual `offers`                         |
| PATCH  | `/api/requests/:id`                 | Update own request (if open)      | Yes   | Partial JSON `{ title?, description?, budget?, location?, deadline?, status? }`                            | `{ jobRequest }`             | Changing `status` to `assigned` requires `assignedTo` to be set |
| DELETE | `/api/requests/:id`                 | Cancel/delete own request         | Yes   | —                                                                                               | `{ success }`                | Only if `status` is `open`                                      |
| GET    | `/api/requests/:id/offers`          | List offers for a request         | Yes   | Query `?status=&page=&limit=`                                                                   | `{ offers[], totalCount }`   | Populates `provider`                                            |
| POST   | `/api/requests/:id/assign/:offerId` | Accept an offer (assign provider) | Yes   | —                                                                                               | `{ jobRequest }`             | Sets `status=assigned` and `assignedTo`                         |
| GET    | `/api/users/me/requests`            | List own requests                 | Yes   | Query `?status=&page=&limit=`                                                                   | `{ requests[], totalCount }` | For seeker dashboard                                            |
| POST   | `/api/requests/:id/complete`        | Mark job as completed             | Yes   | JSON `{ proofImages[], description }`                                                           | `{ jobRequest }`             | Only assigned provider can call                                 |
| POST   | `/api/requests/:id/cancel`          | Cancel assigned job               | Yes   | JSON `{ reason }`                                                                               | `{ jobRequest }`             | Only seeker or assigned provider                                |

---

## 5. Offers

| Method | Path                       | Description                      | Auth? | Input                                                                | Output                     | Notes                                                                 |
| ------ | -------------------------- | -------------------------------- | ----- | -------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| POST   | `/api/requests/:id/offers` | Submit an offer on a job request | Yes   | JSON `{ price: { amount, currency }, message?, estimatedTimeDays?, terms[] }` | `{ offer }`                | Default `status=pending`, optional `expiresAt`                        |
| GET    | `/api/offers`              | List own offers                  | Yes   | Query `?jobId=&status=&page=&limit=`                                 | `{ offers[], totalCount }` | For provider dashboard                                                |
| GET    | `/api/offers/:offerId`     | Get single offer                 | Yes   | —                                                                    | `{ offer }`                | Populates `jobRequest`                                                |
| PATCH  | `/api/offers/:offerId`     | Update own offer (pending only)  | Yes   | Partial `{ price?, message?, estimatedTimeDays?, terms? }`                              | `{ offer }`                | Allow `withdrawn`, `rejected`; accept handled via job assign endpoint |
| DELETE | `/api/offers/:offerId`     | Withdraw own offer               | Yes   | —                                                                    | `{ success }`              | Only if `status=pending`                                              |
| POST   | `/api/offers/:offerId/withdraw` | Withdraw offer              | Yes   | JSON `{ reason }`                                                    | `{ success }`              | Only if `status=pending`                                              |

---

## 6. Service Listings (Gigs)

| Method | Path                     | Description                         | Auth? | Input                                                                                                                            | Output                       | Notes                                         |
| ------ | ------------------------ | ----------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------- |
| POST   | `/api/listings`          | Create a new service listing        | Yes   | JSON `{ title, description, category, price: { amount, currency }, deliveryTimeDays, tags[], attachments[], location: GeoJSON }` | `{ listing }`                | Default `status=active`                       |
| GET    | `/api/listings`          | Search/List public service listings | No    | Query `?category=&tags=&lat=&lng=&radius=&minPrice=&maxPrice=&deliveryTimeDays=&page=&limit=&search=`                            | `{ listings[], totalCount }` | Cache popular results (CDN/Redis, TTL ~5min) |
| GET    | `/api/listings/:id`      | Get single listing details          | No    | —                                                                                                                                | `{ listing }`                | Populates `provider`                          |
| PATCH  | `/api/listings/:id`      | Update own listing                  | Yes   | Partial `{ title?, description?, price?, deliveryTimeDays?, tags?, status? }`                                                    | `{ listing }`                | Only provider/ admin                          |
| DELETE | `/api/listings/:id`      | Archive own listing                 | Yes   | —                                                                                                                                | `{ success }`                | Sets `status=archived`                        |
| GET    | `/api/users/me/listings` | List own service listings           | Yes   | Query `?status=&page=&limit=`                                                                                                    | `{ listings[], totalCount }` | For provider dashboard                        |
| POST   | `/api/listings/:id/pause` | Pause/activate listing             | Yes   | JSON `{ isPaused }`                                                                                                               | `{ listing }`                | Only provider                                |

---

## 7. Reviews & Ratings

| Method | Path                       | Description                    | Auth? | Input                      | Output                      | Notes                          |
| ------ | -------------------------- | ------------------------------ | ----- | -------------------------- | --------------------------- | ------------------------------ |
| POST   | `/api/jobs/:id/review`     | Seeker reviews a completed job | Yes   | JSON `{ rating, comment }` | `{ review }`                | Only if `job.status=completed` |
| POST   | `/api/listings/:id/review` | User reviews a service listing | Yes   | JSON `{ rating, comment }` | `{ review }`                | Only once per user per listing |
| GET    | `/api/users/:id/reviews`   | Get all reviews for a user     | No    | Query `?page=&limit=`      | `{ reviews[], totalCount }` | Populates reviewer info        |
| POST   | `/api/reviews/:id/helpful` | Mark review as helpful          | Yes   | —                          | `{ success }`               | Increments helpfulCount        |
| POST   | `/api/reviews/:id/report`  | Report inappropriate review     | Yes   | JSON `{ reason, description }` | `{ success }`               | Creates report entry           |

---

## 8. File Uploads & Attachments

| Method | Path                   | Description                   | Auth? | Input                             | Output                       | Notes                           |
| ------ | ---------------------- | ----------------------------- | ----- | --------------------------------- | ---------------------------- | ------------------------------- |
| POST   | `/api/uploads`         | Upload a file (image, doc)    | Yes   | `multipart/form-data`: file field | `{ fileId, url, filename }`  | Store in S3/Fawry-ready storage |
| GET    | `/api/uploads/:fileId` | Get file metadata or download | Yes   | —                                 | File stream or metadata JSON | Protected by ACL if needed      |
| DELETE | `/api/uploads/:fileId` | Delete uploaded file           | Yes   | —                                 | `{ success }`                | Only file owner or admin        |
| GET    | `/api/uploads`         | List user's uploaded files    | Yes   | Query `?page=&limit=&type=`       | `{ files[], totalCount }`    | Paginated file list             |

---

## 9. Payments & Completion

| Method | Path                     | Description                            | Auth? | Input                              | Output                      | Notes                                           |
| ------ | ------------------------ | -------------------------------------- | ----- | ---------------------------------- | --------------------------- | ----------------------------------------------- |
| POST   | `/api/jobs/:id/complete` | Mark job as completed with proof image | Yes   | JSON `{ proofImageUrl }`           | `{ jobRequest }`            | Only assigned seeker/provider can call          |
| POST   | `/api/payments`          | Initiate payment (Fawry)               | Yes   | JSON `{ jobId?, listingId?, amount, method }` | `{ paymentUrl, paymentId }` | Redirect user to Fawry gateway                  |
| GET    | `/api/payments/:id`      | Get payment status                     | Yes   | —                                  | `{ payment }`               | Payment details and status                      |
| POST   | `/api/payments/webhook`  | Handle payment status callback         | No    | Fawry's webhook payload            | `{ success }`               | Validates signature, updates job/payment status |
| GET    | `/api/payments`          | List user's payments                   | Yes   | Query `?status=&page=&limit=`      | `{ payments[], totalCount }` | Payment history                                 |
| POST   | `/api/payments/:id/refund` | Request payment refund               | Yes   | JSON `{ reason }`                  | `{ success }`               | Only payer or admin                             |

---

## 10. Notifications

| Method | Path                          | Description               | Auth? | Input                       | Output                            | Notes                       |
| ------ | ----------------------------- | ------------------------- | ----- | --------------------------- | --------------------------------- | --------------------------- |
| GET    | `/api/notifications`          | List own notifications    | Yes   | Query `?read=&page=&limit=` | `{ notifications[], totalCount }` | Push via WebSocket optional |
| PATCH  | `/api/notifications/:id/read` | Mark notification as read | Yes   | —                           | `{ success }`                     |                             |
| PATCH  | `/api/notifications/read-all` | Mark all as read          | Yes   | —                           | `{ success }`                     | Bulk operation               |
| DELETE | `/api/notifications/:id`      | Delete notification       | Yes   | —                           | `{ success }`                     | Only own notifications       |

---

## 11. Reports & Moderation

| Method | Path                    | Description                    | Auth? | Input                                    | Output                | Notes                    |
| ------ | ----------------------- | ------------------------------ | ----- | ---------------------------------------- | --------------------- | ------------------------ |
| POST   | `/api/reports`          | Report user/content            | Yes   | JSON `{ reportedUser?, reportedJob?, reportedService?, reason, description, evidence[] }` | `{ report }`          | Creates moderation ticket |
| GET    | `/api/admin/reports`    | List all reports (admin only)  | Yes   | Query `?status=&page=&limit=`            | `{ reports[], totalCount }` | Requires `role=admin`    |
| PATCH  | `/api/admin/reports/:id` | Update report status           | Yes   | JSON `{ status, adminNotes }`            | `{ report }`          | Requires `role=admin`    |
| GET    | `/api/reports`          | List own reports               | Yes   | Query `?status=&page=&limit=`            | `{ reports[], totalCount }` | User's own reports       |

---

## 12. Analytics & Dashboard

| Method | Path                    | Description                    | Auth? | Input                                    | Output                | Notes                    |
| ------ | ----------------------- | ------------------------------ | ----- | ---------------------------------------- | --------------------- | ------------------------ |
| GET    | `/api/analytics/overview` | Get dashboard overview        | Yes   | Query `?period=week&month&year`          | `{ stats }`           | User-specific analytics  |
| GET    | `/api/analytics/earnings` | Get earnings analytics        | Yes   | Query `?period=week&month&year`          | `{ earnings }`        | For providers            |
| GET    | `/api/analytics/spending` | Get spending analytics        | Yes   | Query `?period=week&month&year`          | `{ spending }`        | For seekers              |
| GET    | `/api/admin/analytics`   | Platform-wide analytics        | Yes   | Query `?period=week&month&year`          | `{ platformStats }`   | Requires `role=admin`    |

---

## 13. Search & Discovery

| Method | Path                    | Description                    | Auth? | Input                                    | Output                | Notes                    |
| ------ | ----------------------- | ------------------------------ | ----- | ---------------------------------------- | --------------------- | ------------------------ |
| GET    | `/api/search`           | Global search                  | No    | Query `?q=&type=&category=&location=&page=&limit=` | `{ results[] }`       | Search jobs, listings, users |
| GET    | `/api/search/providers` | Search providers               | No    | Query `?category=&location=&rating=&page=&limit=` | `{ providers[] }`     | Provider discovery        |
| GET    | `/api/search/jobs`      | Advanced job search            | No    | Query `?category=&budget=&location=&urgent=&page=&limit=` | `{ jobs[] }`          | Advanced job filtering    |

---

## 14. Utilities & Health

| Method | Path          | Description                   | Auth? | Input | Output                     | Notes                     |
| ------ | ------------- | ----------------------------- | ----- | ----- | -------------------------- | ------------------------- |
| GET    | `/api/health` | Service health/liveness check | No    | —     | `{ status: 'ok', uptime }` | Kubernetes liveness probe |
| GET    | `/api/config` | Get app configuration         | No    | —     | `{ config }`               | Feature flags, settings   |
| POST   | `/api/contact` | Contact support               | No    | JSON `{ name, email, subject, message }` | `{ success }`            | Support ticket creation   |

---

## 15. WebSocket Events

| Event | Description | Auth? | Payload | Notes |
| ----- | ----------- | ----- | ------- | ----- |
| `job_created` | New job posted | No | `{ jobRequest }` | Broadcast to relevant providers |
| `offer_received` | New offer on job | Yes | `{ offer }` | Send to job seeker |
| `job_assigned` | Job assigned to provider | Yes | `{ jobRequest }` | Send to both parties |
| `payment_completed` | Payment successful | Yes | `{ payment }` | Send to both parties |
| `notification` | New notification | Yes | `{ notification }` | Real-time notifications |

---

## Response Format Standards

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [ /* validation errors */ ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalCount": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": "user_id",
  "role": "seeker|provider|admin",
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1640998800
}
```

### Role-Based Access Control
- **Seeker**: Can create jobs, accept offers, make payments
- **Provider**: Can submit offers, complete jobs, create listings
- **Admin**: Full platform access, moderation, analytics

---

## Rate Limiting

| Endpoint Category | Rate Limit | Window |
| ----------------- | ---------- | ------ |
| Authentication | 5 requests | 15 minutes |
| File Uploads | 10 requests | 1 hour |
| Job Creation | 3 requests | 1 hour |
| Offer Submission | 5 requests | 1 hour |
| API General | 100 requests | 1 hour |

---

## Error Codes

| Code | Description | HTTP Status |
| ---- | ----------- | ----------- |
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Resource already exists | 409 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

---

*All list endpoints support pagination via `page` (default 1) and `limit` (default 20), returning `{ items[], totalCount, page, limit }`. Geo-search queries use `lat`, `lng`, and `radius` (in meters).* 