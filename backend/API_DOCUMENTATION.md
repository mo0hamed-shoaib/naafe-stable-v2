# Naafe' API Documentation

## User Profile Endpoints

### 1. Get Current User Profile
**GET** `/api/users/me`

Get the profile of the currently authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "name": {
        "first": "John",
        "last": "Doe"
      },
      "phone": "01012345678",
      "role": "seeker",
      "avatarUrl": "https://example.com/avatar.jpg",
      "profile": {
        "bio": "User bio",
        "location": {
          "type": "Point",
          "coordinates": [31.2357, 30.0444],
          "address": "Cairo, Egypt"
        }
      },
      "isActive": true,
      "lastLoginAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "User profile retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Update Current User Profile
**PATCH** `/api/users/me`

Update the profile of the currently authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": {
    "first": "John",
    "last": "Updated"
  },
  "phone": "01087654321",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "profile": {
    "bio": "Updated bio",
    "location": {
      "type": "Point",
      "coordinates": [31.2357, 30.0444],
      "address": "Cairo, Egypt"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "name": {
        "first": "John",
        "last": "Updated"
      },
      "phone": "01087654321",
      "role": "seeker",
      "avatarUrl": "https://example.com/new-avatar.jpg",
              "profile": {
          "bio": "Updated bio",
          "location": {
            "type": "Point",
            "coordinates": [31.2357, 30.0444],
            "address": "Cairo, Egypt"
          }
        },
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Profile updated successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Get Public User Profile
**GET** `/api/users/:id`

Get the public profile of a user by their ID. This endpoint is public and doesn't require authentication, but if authenticated, it may return additional information.

**Parameters:**
- `id` (string, required): User ID

**Headers (optional):**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": {
        "first": "John",
        "last": "Doe"
      },
      "role": "provider",
      "avatarUrl": "https://example.com/avatar.jpg",
      "profile": {
        "bio": "User bio"
      },
      "rating": 4.5,
      "reviewCount": 10,
      "totalJobsCompleted": 25,
      "totalEarnings": 5000,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "User profile retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 4. Get User Statistics
**GET** `/api/users/:id/stats`

Get statistics for a specific user.

**Parameters:**
- `id` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "userId": "user_id",
      "role": "provider",
      "rating": 4.5,
      "reviewCount": 10,
      "totalJobsCompleted": 25,
      "totalEarnings": 5000
    }
  },
  "message": "User statistics retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "name.first",
        "message": "First name must be between 2 and 50 characters",
        "value": "J"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Not Found Error
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Unauthorized Error
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Access token is required"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Validation Rules

### Profile Update Validation
- **name.first**: 2-50 characters
- **name.last**: 2-50 characters
- **phone**: Valid Egyptian phone number format
- **avatarUrl**: Valid URL
- **profile.bio**: Maximum 1000 characters
- **profile.location.coordinates**: Array of [longitude, latitude]
- **profile.location.address**: Maximum 200 characters

### Security Features
- Sensitive fields (email, phone) are excluded from public profiles
- Users can only update their own profiles
- Role and account status cannot be modified through profile updates
- Location coordinates are validated for proper GeoJSON format

---

## Category Endpoints

### 1. Get All Categories
**GET** `/api/categories`

Get all categories with optional filtering.

**Query Parameters:**
- `includeInactive` (boolean, optional): Include inactive categories
- `includeTree` (boolean, optional): Return hierarchical tree structure

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "category_id",
        "name": "Web Development",
        "description": "Web development services",
        "icon": "fas fa-code",
        "slug": "web-development",
        "order": 1,
        "isActive": true,
        "parentId": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "message": "Categories retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get Categories for Dropdown
**GET** `/api/categories/dropdown`

Get a simplified list of categories for dropdown menus.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "category_id",
        "name": "Web Development",
        "slug": "web-development",
        "parentId": null
      }
    ]
  },
  "message": "Categories for dropdown retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Get Category by ID
**GET** `/api/categories/:id`

Get a specific category by its ID.

**Parameters:**
- `id` (string, required): Category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "category_id",
      "name": "Web Development",
      "description": "Web development services",
      "icon": "fas fa-code",
      "slug": "web-development",
      "order": 1,
      "isActive": true,
      "parentId": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Category retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 4. Get Category Hierarchy
**GET** `/api/categories/:id/hierarchy`

Get the complete hierarchy for a category including parent and children.

**Parameters:**
- `id` (string, required): Category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "hierarchy": {
      "current": {
        "_id": "category_id",
        "name": "Web Development"
      },
      "parent": null,
      "children": [
        {
          "_id": "child_id",
          "name": "Frontend Development"
        }
      ]
    }
  },
  "message": "Category hierarchy retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 5. Create Category
**POST** `/api/categories`

Create a new category (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Web Development",
  "description": "Web development services including frontend and backend development",
  "icon": "fas fa-code",
  "order": 1,
  "parentId": null,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "category_id",
      "name": "Web Development",
      "description": "Web development services including frontend and backend development",
      "icon": "fas fa-code",
      "slug": "web-development",
      "order": 1,
      "isActive": true,
      "parentId": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Category created successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 6. Update Category
**PUT** `/api/categories/:id`

Update an existing category (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Parameters:**
- `id` (string, required): Category ID

**Request Body:**
```json
{
  "name": "Updated Web Development",
  "description": "Updated description",
  "order": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "category_id",
      "name": "Updated Web Development",
      "description": "Updated description",
      "slug": "updated-web-development",
      "order": 2,
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Category updated successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 7. Delete Category
**DELETE** `/api/categories/:id`

Delete a category (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id` (string, required): Category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Category deleted successfully"
  },
  "message": "Category deleted successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Category Validation Rules

### Create/Update Category Validation
- **name**: 2-100 characters (required for create)
- **description**: Maximum 500 characters (optional)
- **icon**: Maximum 100 characters (optional)
- **order**: Non-negative integer (optional)
- **parentId**: Valid MongoDB ObjectId (optional)
- **isActive**: Boolean (optional)

### Category Features
- **Hierarchical Structure**: Categories can have parent-child relationships
- **Slug Generation**: Automatic slug generation from category name
- **Circular Reference Prevention**: Categories cannot be their own parent or descendant
- **Duplicate Prevention**: Category names must be unique (case-insensitive)
- **Active Status**: Categories can be activated/deactivated
- **Ordering**: Categories can be ordered for display
- **Admin Only**: Create, update, and delete operations require admin role 