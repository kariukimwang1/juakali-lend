# JuaKali Lend - Financial Platform

A comprehensive financial platform built for Kenya's entrepreneurial ecosystem, supporting multiple user roles including administrators, lenders, suppliers, and retailers.

## 🏗️ Architecture

This application is built with:
- **Frontend**: React 19 with TypeScript, Tailwind CSS, React Router
- **Backend**: Hono.js (Cloudflare Workers)
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: Mocha Users Service (OAuth with Google)
- **Hosting**: Cloudflare Workers and Pages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account
- Wrangler CLI installed globally: `npm install -g wrangler`

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd juakali-lend
npm install
```

### 2. Environment Setup

1. Login to Cloudflare:
```bash
wrangler login
```

2. Create your Cloudflare D1 database:
```bash
wrangler d1 create juakali-lend-db
```

3. Copy the database ID from the output and update `wrangler.jsonc`:
```json
{
  "database_id": "your-database-id-here"
}
```

### 3. Database Setup

The application uses Cloudflare D1 for data storage. Here's how to set it up:

#### Database Migration

1. **Run migrations locally** (for development):
```bash
wrangler d1 execute juakali-lend-db --local --file=./src/migrations/1.sql
wrangler d1 execute juakali-lend-db --local --file=./src/migrations/2.sql
wrangler d1 execute juakali-lend-db --local --file=./src/migrations/3.sql
```

2. **Run migrations in production**:
```bash
wrangler d1 execute juakali-lend-db --file=./src/migrations/1.sql
wrangler d1 execute juakali-lend-db --file=./src/migrations/2.sql
wrangler d1 execute juakali-lend-db --file=./src/migrations/3.sql
```

#### Database Schema Overview

The application uses the following main tables:

- **users**: Core user information with roles (admin, lender, supplier, retailer, customer)
- **user_profiles**: Extended profile information specific to user roles
- **user_sessions**: Session management for authentication
- **user_security_settings**: Security configurations per user
- **otp_codes**: One-time passwords for verification
- **admin_access_logs**: Audit logs for admin actions

### 4. Authentication Setup

The application uses Mocha Users Service for authentication. The required secrets are:

- `MOCHA_USERS_SERVICE_API_KEY`
- `MOCHA_USERS_SERVICE_API_URL`

These are already configured in your environment.

### 5. Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 Database Management

### Viewing Database Contents

**Local development:**
```bash
# View all tables
wrangler d1 execute juakali-lend-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"

# View users
wrangler d1 execute juakali-lend-db --local --command="SELECT * FROM users LIMIT 10;"

# View user profiles
wrangler d1 execute juakali-lend-db --local --command="SELECT * FROM user_profiles LIMIT 10;"
```

**Production:**
```bash
# View users in production
wrangler d1 execute juakali-lend-db --command="SELECT * FROM users LIMIT 10;"
```

### Adding New Migrations

1. Create a new migration file in `src/migrations/` (e.g., `4.sql`)
2. Write your migration SQL
3. Run it locally first:
```bash
wrangler d1 execute juakali-lend-db --local --file=./src/migrations/4.sql
```
4. Test your changes
5. Deploy to production:
```bash
wrangler d1 execute juakali-lend-db --file=./src/migrations/4.sql
```

### Database Best Practices

1. **No Foreign Keys**: D1 doesn't support foreign key constraints. Handle relationships in application code.
2. **Simple Types**: Use basic SQLite types (TEXT, INTEGER, REAL, BLOB, BOOLEAN, DATETIME, DATE)
3. **Nullable Fields**: Default to nullable fields for flexibility
4. **Application Logic**: Keep business logic, validation, and relationships in the application layer

## 🏗️ Application Structure

### User Roles & Access

The application supports four main user roles:

1. **Admin** (`/admin/*`)
   - User management
   - System analytics
   - Security controls
   - Platform settings
   - Requires manual approval

2. **Lender** (`/lender/*`)
   - Investment tracking
   - Risk assessment
   - Portfolio management
   - Returns analytics

3. **Supplier** (`/supplier/*`)
   - Inventory management
   - Order processing
   - Customer relations
   - Analytics dashboard

4. **Retailer/Customer** (`/retailer/*`)
   - Product catalog
   - Order management
   - Financial tools
   - Loan applications

### Authentication Flow

1. User selects role on login/register page
2. OAuth authentication with Google via Mocha Users Service
3. User profile created/updated with role-specific data
4. Automatic redirect to appropriate dashboard based on role

### Directory Structure

```
src/
├── react-app/                    # Main React application
│   ├── components/              # Shared UI components
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Main page components
│   ├── admin/                   # Admin dashboard
│   ├── lender/                  # Lender dashboard
│   ├── supplier/                # Supplier dashboard
│   ├── retailer/                # Retailer dashboard
│   └── i18n/                    # Internationalization
├── worker/                      # Cloudflare Worker (API)
├── migrations/                  # Database migrations
└── shared/                      # Shared types and utilities
```

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Type checking
npx tsc --noEmit

# Build for production
npm run build

# Deploy to Cloudflare
wrangler deploy

# Database operations
wrangler d1 execute juakali-lend-db --local --file=./path/to/migration.sql
wrangler d1 execute juakali-lend-db --command="SELECT * FROM users;"

# Generate TypeScript types from Cloudflare
npm run cf-typegen
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Deploy to Cloudflare Workers**:
```bash
wrangler deploy
```

3. **Run production migrations** (if needed):
```bash
wrangler d1 execute juakali-lend-db --file=./src/migrations/1.sql
```

### Environment Variables

Ensure these secrets are set in your Cloudflare Workers environment:
- `MOCHA_USERS_SERVICE_API_KEY`
- `MOCHA_USERS_SERVICE_API_URL`

## 🔐 Security Features

- **Role-based Access Control**: Each user role has specific permissions and dashboard access
- **OAuth Authentication**: Secure authentication via Google OAuth through Mocha Users Service
- **Session Management**: Secure session handling with proper expiration
- **Admin Approval**: Administrator accounts require manual approval
- **Audit Logging**: All admin actions are logged for security monitoring
- **Rate Limiting**: Built-in rate limiting for API endpoints
- **Input Validation**: Comprehensive input validation using Zod schemas

## 🌍 Multi-language Support

The application supports:
- English (en)
- Swahili (sw)

Language files are located in `src/react-app/i18n/locales/`

## 📊 API Endpoints

### Authentication
- `GET /api/oauth/google/redirect_url` - Get OAuth redirect URL
- `POST /api/sessions` - Create session from OAuth code
- `GET /api/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user profile
- `POST /api/users/register` - Register new user with role

### OTP
- `POST /api/otp/send` - Send OTP for verification
- `POST /api/otp/verify` - Verify OTP code

### Admin (Protected)
- `GET /api/admin/users` - List all users
- `GET /api/admin/access-logs` - View access logs

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Ensure your database ID in `wrangler.jsonc` is correct
   - Check that migrations have been run

2. **Authentication issues**:
   - Verify `MOCHA_USERS_SERVICE_*` secrets are set
   - Check OAuth callback URLs are configured correctly

3. **Build errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors with `npx tsc --noEmit`

4. **CORS issues**:
   - Ensure your domain is added to the CORS configuration in `src/worker/index.ts`

### Debug Commands

```bash
# Check logs
wrangler tail

# Test database connection
wrangler d1 execute juakali-lend-db --command="SELECT 1;"

# View current user sessions
wrangler d1 execute juakali-lend-db --command="SELECT * FROM user_sessions WHERE is_active = 1;"
```

## 📝 Contributing

1. Follow the existing code structure and naming conventions
2. Add proper TypeScript types for new features
3. Test database changes locally before deploying
4. Update this README when adding new features or changing setup procedures

## 📄 License

This project is proprietary software for JuaKali Lend platform.

---

For support or questions, please contact the development team.
