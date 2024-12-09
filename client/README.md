# ShopNet Client

React frontend for ShopNet e-commerce platform.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared UI components
│   ├── layout/          # Layout components
│   └── products/        # Product-related components
│
├── features/            # Redux slices
│   ├── auth/
│   ├── cart/
│   ├── products/
│   └── settings/
│
├── store/               # Redux store configuration
│
├── types/               # TypeScript types
│
├── utils/              # Utility functions
│
└── pages/              # Page components
```

## Key Dependencies

- React 18
- TypeScript
- Redux Toolkit
- React Router
- TailwindCSS
- Framer Motion
- Axios

## Development Guidelines

### Component Structure
- Use functional components with TypeScript
- Implement proper type definitions
- Use common components from the `components/common` directory
- Follow the established folder structure

### Styling
- Use TailwindCSS for styling
- Follow the custom theme configuration in `tailwind.config.js`
- Use the defined color palette and design tokens

### State Management
- Use Redux Toolkit for global state
- Use local state (useState) for component-specific state
- Follow the established slice pattern in `features/`

### API Integration
- Use axios instances from `utils/api`
- Handle errors consistently
- Implement proper loading states

## Common Issues & Solutions

### CORS Issues
If you encounter CORS issues, make sure:
1. The server is running
2. You're using the correct API URL
3. CORS is properly configured on the server

### Authentication
- JWT tokens are stored securely
- Protected routes are properly configured
- User session handling is implemented correctly

