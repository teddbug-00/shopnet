# ShopNet Server

## Initial Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment:
```bash
# Copy the example environment file
cp .env.example .env

# Generate a JWT secret and add it to your .env file
# Run this command in your terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. Update your `.env` file with:
   - Your database connection string
   - Your generated JWT secret
   - Other environment variables as needed

4. Setup the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

### Required Variables
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Your generated secret key for JWT tokens
- `PORT`: Server port (defaults to 5000)

### Generating JWT Secret
You can generate a secure random string for JWT_SECRET using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your JWT_SECRET in `.env`

### Example .env Configuration
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/shopnet"
JWT_SECRET="your_generated_secret"
```