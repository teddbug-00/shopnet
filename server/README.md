# ShopNet Server

Node.js backend for ShopNet e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
# Copy environment file
cp .env.example .env

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. Configure database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

4. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── controllers/        # Request handlers
├── middleware/        # Express middleware
├── routes/           # API routes
└── types/           # TypeScript types
```

## API Documentation

### Auth Endpoints

```typescript
POST /api/users/register
Body: {
  email: string
  password: string
  name: string
}

POST /api/users/login
Body: {
  email: string
  password: string
}

PUT /api/users/account-type
Body: {
  accountType: "buyer" | "seller"
  profile: {
    phone?: string
    address?: string
    businessName?: string
    businessDescription?: string
  }
}
```

### Product Endpoints

```typescript
GET /api/products
Query: {
  view?: "seller"  // Optional, for seller's products
}

POST /api/products
Body: {
  title: string
  description: string
  price: number
  category: string
  // ... other product fields
}

GET /api/products/:id
PUT /api/products/:id
DELETE /api/products/:id
```

## Database

### Models
Key models are defined in `prisma/schema.prisma`:
- User
- Profile
- Product

### Migrations
```bash
# Create a migration
npx prisma migrate dev --name describe_your_change

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## Error Handling

The server uses a consistent error response format:
```typescript
{
  error: string
  details?: any
}
```

## Development Guidelines

1. Always validate request data
2. Use proper HTTP status codes
3. Implement proper error handling
4. Write clean, typed code
5. Follow the established project structure
