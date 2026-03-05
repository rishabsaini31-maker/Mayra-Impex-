# API Documentation - Mayra Impex Backend

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register Customer

**POST** `/auth/register`

Register a new customer account.

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

---

### Login

**POST** `/auth/login`

Login with phone and password.

**Request Body:**

```json
{
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

---

### Get Profile

**GET** `/auth/profile`

Get current user profile. Requires authentication.

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "customer",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Category Endpoints

### Get All Categories

**GET** `/categories`

Get list of all categories. Public endpoint.

**Response:**

```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Electronics",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 5
}
```

---

### Create Category

**POST** `/categories`

Create new category. Requires admin authentication.

**Request Body:**

```json
{
  "name": "New Category"
}
```

**Response:**

```json
{
  "message": "Category created successfully",
  "category": {
    "id": "uuid",
    "name": "New Category",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Category

**DELETE** `/categories/:id`

Delete a category. Requires admin authentication.

**Response:**

```json
{
  "message": "Category deleted successfully"
}
```

---

## Product Endpoints

### Get All Products

**GET** `/products`

Get paginated list of products. Public endpoint.

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 20)
- `category_id` (optional)
- `is_active` (optional: true/false)
- `search` (optional)

**Example:**

```
GET /products?page=1&limit=20&category_id=uuid&is_active=true&search=laptop
```

**Response:**

```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Description",
      "price": 1299.99,
      "category_id": "uuid",
      "image_url": "https://...",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "categories": {
        "id": "uuid",
        "name": "Electronics"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### Get Product by ID

**GET** `/products/:id`

Get single product details.

**Response:**

```json
{
  "product": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Description",
    "price": 1299.99,
    "category_id": "uuid",
    "image_url": "https://...",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "categories": {
      "id": "uuid",
      "name": "Electronics"
    }
  }
}
```

---

### Create Product

**POST** `/products`

Create new product. Requires admin authentication.

**Request Body:**

```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 999.99,
  "category_id": "uuid",
  "image_url": "https://...",
  "is_active": true
}
```

**Response:**

```json
{
  "message": "Product created successfully",
  "product": {
    /* product object */
  }
}
```

---

### Update Product

**PUT** `/products/:id`

Update existing product. Requires admin authentication.

**Request Body:**

```json
{
  "name": "Updated Name",
  "price": 1099.99,
  "is_active": false
}
```

**Response:**

```json
{
  "message": "Product updated successfully",
  "product": {
    /* updated product object */
  }
}
```

---

### Delete Product

**DELETE** `/products/:id`

Delete a product. Requires admin authentication.

**Response:**

```json
{
  "message": "Product deleted successfully"
}
```

---

### Upload Product Image

**POST** `/products/upload-image`

Upload product image to Supabase Storage. Requires admin authentication.

**Request:**

- Content-Type: `multipart/form-data`
- Field name: `image`
- Max size: 5MB
- Allowed: jpeg, jpg, png, webp

**Response:**

```json
{
  "message": "Image uploaded successfully",
  "image_url": "https://supabase-storage-url/..."
}
```

---

## Order Endpoints

### Place Order

**POST** `/orders`

Place a new order. Requires customer authentication.

**Request Body:**

```json
{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 5
    },
    {
      "product_id": "uuid",
      "quantity": 10
    }
  ]
}
```

**Response:**

```json
{
  "message": "Order placed successfully",
  "order": {
    "id": "uuid",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z",
    "pdf_url": "https://supabase-storage-url/..."
  }
}
```

**Side Effects:**

- Creates order in database
- Generates PDF
- Uploads PDF to storage
- Sends email with PDF attachment
- Sends WhatsApp message with order details

---

### Get My Orders

**GET** `/orders/my-orders`

Get current customer's orders. Requires customer authentication.

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 20)

**Response:**

```json
{
  "orders": [
    {
      "id": "uuid",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z",
      "order_items": [
        {
          "id": "uuid",
          "quantity": 5,
          "products": {
            "id": "uuid",
            "name": "Product Name",
            "price": 999.99,
            "image_url": "https://..."
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### Get All Orders (Admin)

**GET** `/orders/all`

Get all orders from all customers. Requires admin authentication.

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional: pending/approved/rejected)

**Response:**

```json
{
  "orders": [
    {
      "id": "uuid",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z",
      "users": {
        "id": "uuid",
        "name": "John Doe",
        "phone": "9876543210"
      },
      "order_items": [
        {
          "id": "uuid",
          "quantity": 5,
          "products": {
            "id": "uuid",
            "name": "Product Name",
            "price": 999.99
          }
        }
      ]
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

---

### Get Order by ID

**GET** `/orders/:id`

Get order details. Customers can only view their own orders.

**Response:**

```json
{
  "order": {
    "id": "uuid",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z",
    "users": {
      "id": "uuid",
      "name": "John Doe",
      "phone": "9876543210"
    },
    "order_items": [
      /* ... */
    ]
  }
}
```

---

### Update Order Status

**PUT** `/orders/:id/status`

Update order status. Requires admin authentication.

**Request Body:**

```json
{
  "status": "approved"
}
```

**Allowed values:** `pending`, `approved`, `rejected`

**Response:**

```json
{
  "message": "Order status updated successfully",
  "order": {
    "id": "uuid",
    "status": "approved",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Dashboard Stats

**GET** `/orders/dashboard-stats`

Get admin dashboard statistics. Requires admin authentication.

**Response:**

```json
{
  "stats": {
    "totalProducts": 150,
    "totalOrders": 500,
    "pendingOrders": 25,
    "totalCustomers": 200
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "phone",
      "message": "Phone must be 10 digits"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "No token provided"
}
```

### 403 Forbidden

```json
{
  "error": "Admin access required"
}
```

### 404 Not Found

```json
{
  "error": "Product not found"
}
```

### 409 Conflict

```json
{
  "error": "Phone number already registered"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Order endpoints: 10 requests per 15 minutes per IP

---

## Example cURL Requests

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phone":"9876543210","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","password":"password123"}'
```

### Get Products

```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=20"
```

### Place Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"product_id":"uuid","quantity":5}]}'
```

---

**API Version:** 1.0.0  
**Last Updated:** March 2026
