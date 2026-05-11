# 2026-05-08 Admin Dashboard Enhancements and Analytics Upgrade

## Context
The administrator dashboard required deeper analytical insights and a more robust authentication mechanism to facilitate better decision-making and secure access.

## Decision
We upgraded the administration system to include advanced visitor analytics and refactored the authentication flow for better flexibility and security.

## Implementation Details

### 1. Advanced Analytics Upgrade
- **New Metrics**: Added hourly traffic analysis, device distribution (Mobile/Desktop/Tablet), and browser statistics.
- **Conversion Tracking**: Integrated lead conversion rates by referrer and page to identify high-performing marketing channels.
- **Day-of-Week Analysis**: Added traffic distribution by day of the week to understand weekly patterns.
- **API Enhancement**: Updated `/api/admin/analytics/stats` to aggregate and provide these new datasets.

### 2. Admin Authentication Refactoring
- **Secret Key Logic**: Refactored `src/lib/auth.ts` to support both session-based and secret-key-based (x-admin-secret) authentication.
- **Environment Variables**: Moved the hardcoded admin secret to environment variables for improved security.
- **Client Clean-up**: Removed hardcoded secrets from frontend admin pages to prevent accidental exposure.

### 3. Dashboard UI Improvements
- **Statistics Page**: Implemented new visual tables for referrer conversion and page-specific lead counts.
- **Admin Home**: Added a summary section for referrer-based conversion tracking.
- **Board/Leads/Columns**: Updated data fetching logic to use the unified authentication pattern.

### 4. Stability and Validation
- **Consultation API**: Enhanced input validation using Zod and improved error reporting.
- **Health Check**: Added a basic health check endpoint at `/api/health`.

## Consequences
- Administrators now have access to granular data regarding visitor behavior and lead quality.
- Security is improved by removing hardcoded credentials from the client-side code.
- The codebase is more maintainable with a centralized authentication logic in `src/lib/auth.ts`.
