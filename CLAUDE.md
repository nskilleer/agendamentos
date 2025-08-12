# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgendaFácil is a manicure appointment system currently in migration from traditional HTML pages to React. The system serves nail professionals and their clients with scheduling, service management, and appointment tracking.

**Migration Status**: The project runs in hybrid mode with both legacy HTML and new React interfaces.

## Development Commands

### Backend (Node.js/Express)
```bash
cd backend
npm install
npm run dev    # Development with nodemon
npm start      # Production
```

### Frontend (React/Vite)
```bash
npm install
npm run dev    # Development server (http://localhost:5173)
npm run build  # Production build
npm run lint   # ESLint
```

### Running Both Systems
- Backend serves on port 3333 (API + legacy HTML pages)
- React frontend serves on port 5173 (new interface)
- Both need to run simultaneously during migration

## Architecture

### Dual Frontend Architecture
The project maintains two parallel frontend systems:

**Legacy HTML (`backend/public/`):**
- Static HTML pages with vanilla JS
- Served directly by Express server at port 3333
- Still functional and used in production
- Files: `login.html`, `painelpro.html`, `painelcli.html`, etc.

**React Frontend (`src/`):**
- Modern React components
- Served by Vite dev server at port 5173
- Uses Context API for state management (AuthContext, ThemeContext)
- API communication via axios with interceptors

### Backend Structure
- **Entry**: `index.js` → `app.js` → `routes.js`
- **Models**: Mongoose schemas (User, Service, Appointment, Schedule)
- **Controllers**: Business logic in `controles/` directory
- **Middleware**: Custom auth, db, error handling
- **Session-based authentication** with MongoDB session store

### Key Architectural Patterns

**Authentication Flow:**
- Session-based auth using express-session + connect-mongo
- Dual middleware handling: HTML redirects OR JSON responses
- AuthContext for React components
- Session validation on protected routes

**Database Models:**
- **User**: Supports 'cliente', 'profissional', 'admin' types
- **Service**: Manicure services (duration, price)
- **Appointment**: Bookings with cascading deletion
- **Schedule**: Professional availability hours

**API Structure:**
- Public routes: `/api/login`, `/api/register`, `/api/check_session`
- Protected routes: Require authentication middleware
- Role-based access: `checkUserType(['profissional'])` for business features

## Environment Configuration

Required environment variables in `backend/variaveisambiente.env`:
```
SESSION_SECRET=your_secret_key
MONGODB_URI=mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Development Patterns

### API Communication
React components use centralized axios instance (`src/services/api.js`) with:
- Base URL configuration via environment variables
- Credentials included for session cookies
- 401 redirect interceptor

### Route Protection
Backend uses middleware chain:
1. `dbMiddleware` - Ensures database connection
2. `requireAuth` - Validates session
3. `checkUserType` - Role-based access control

### Error Handling
- Winston logging with file outputs
- Custom error middleware for consistent API responses
- Frontend error boundaries for React components

## Migration Considerations

When working on this project:

1. **Check both systems**: Changes may affect HTML and React versions
2. **API endpoints**: Some endpoints serve both systems (check routes.js)
3. **Authentication**: Session-based, ensure cookies work across both frontends
4. **Database**: Shared MongoDB instance, model changes affect everything
5. **CORS**: Configured for React dev server on port 5173

## Domain-Specific Context

This is a **manicure/nail salon** appointment system:
- Services: manicure, pedicure, nail art, spa treatments
- Users: nail professionals (manage schedules) and clients (book appointments)
- Business logic: availability checking, appointment conflicts, service durations
- Future features may include nail art image uploads, WhatsApp integration

## Critical Files

- `backend/app.js` - Express configuration, middleware setup
- `backend/routes.js` - All API endpoints
- `backend/middlewares/authMiddleware.js` - Session validation logic
- `src/contexts/AuthContext.jsx` - React authentication state
- `src/services/api.js` - Centralized HTTP client configuration
- `backend/variaveisambiente.env` - Environment configuration