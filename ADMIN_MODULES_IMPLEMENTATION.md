# Admin Modules Implementation - Frontend

This document describes the implementation of the Preferences, Feature Flags, and Audit Logs modules in the Next.js ERP frontend.

## Overview

Three new admin modules have been implemented:

1. **Preferences Module** (`/dashboard/admin/preferences`)
2. **Feature Flags Module** (`/dashboard/admin/feature-flags`)
3. **Audit Logs Module** (`/dashboard/admin/audit-logs`)

## Module Structure

Each module follows a clean architecture pattern with the following structure:

```
module-name/
├── page.tsx                           # Main page (Server Component)
├── application/
│   └── use-cases/
│       └── module.actions.ts          # Server actions for API calls
├── domain/
│   └── entities/
│       └── entity.ts                  # TypeScript interfaces/types
└── presentation/
    ├── components/
    │   └── ModulePage.tsx             # Client components
    └── hooks/
        └── use-module.ts              # React Query hooks
```

## 1. Preferences Module

### Location
`/Users/carlosvelasco/Documents/carlos/nextjs/erp_project/src/app/dashboard/admin/preferences/`

### Features
- Browse and filter preference definitions by module and category
- Search preferences by name, code, or description
- View current values at different scopes (system, company, branch, user)
- Edit preference values with a modal dialog
- Support for different value types:
  - Boolean (Switch)
  - String (Input or Select for allowed values)
  - Integer/Decimal (Number input)
  - JSON (Text input with JSON validation)

### Components

#### PreferencesPage.tsx
Main client component that orchestrates the preferences UI.
- Filters by module and search query
- Groups preferences by category
- Manages the edit dialog state

#### PreferenceCard.tsx
Displays a single preference with:
- Name, code, and description
- Current value input control
- Values at each scope (system, company, user, branch)
- Edit button

#### PreferenceCategorySection.tsx
Groups preferences by category with icon and title.

#### PreferenceValueEditor.tsx
Modal dialog for editing preference values:
- Select scope (company, branch, user)
- Value input based on type
- Validation rules display
- Save/Cancel actions

### API Endpoints Used
- `POST /onerp/system/preferences/definitions` - Get preference definitions
- `POST /onerp/system/preferences/resolve-all` - Resolve all preferences for context
- `PATCH /onerp/system/preferences/value` - Set preference value

### Server Actions
File: `application/use-cases/preference.actions.ts`

```typescript
getPreferenceDefinitions(params?: GetPreferenceDefinitionsParams)
getPreferenceValue(code: string, context: PreferenceContext)
resolveAllPreferences(context: PreferenceContext)
setPreferenceValue(params: SetPreferenceValueParams)
getPreferenceHistory(code: string, companyId: string)
```

## 2. Feature Flags Module

### Location
`/Users/carlosvelasco/Documents/carlos/nextjs/erp_project/src/app/dashboard/admin/feature-flags/`

### Features
- List all feature flags with status indicators
- Filter by module and status (enabled/disabled)
- Search by name, code, or description
- Toggle feature flags for the company
- View rollout percentage with progress bar
- Color-coded modules

### Components

#### FeatureFlagsPage.tsx
Main client component for feature flags management.
- Multiple filters (module, status, search)
- Real-time toggle with optimistic updates
- Loading and error states

#### FeatureFlagCard.tsx
Displays a feature flag with:
- Status indicator (green/red dot)
- Module badge with color coding
- Description
- Rollout progress bar
- Toggle switch

### API Endpoints Used
- `POST /onerp/system/feature-flags` - Get all feature flags
- `POST /onerp/system/feature-flags/check` - Check if feature is enabled
- `PATCH /onerp/system/feature-flags/company` - Set company flag
- `GET /onerp/system/feature-flags/company` - Get company flags

### Server Actions
File: `application/use-cases/feature-flag.actions.ts`

```typescript
getAllFeatureFlags()
isFeatureEnabled(code: string)
setCompanyFlag(params: SetCompanyFlagParams)
getCompanyFlags(companyId?: string)
```

## 3. Audit Logs Module

### Location
`/Users/carlosvelasco/Documents/carlos/nextjs/erp_project/src/app/dashboard/admin/audit-logs/`

### Features
- Browse audit logs with multiple filters
- Filter by entity type, action, and date range
- View detailed information for each log entry
- Pagination support
- Export functionality (placeholder)
- View changes and metadata in formatted JSON

### Components

#### AuditLogsPage.tsx
Main client component for audit logs.
- Multiple filters (entity type, action, date range)
- Custom date range support
- Pagination controls
- Export button

#### AuditLogTable.tsx
Table component displaying audit logs with:
- Date and time
- Username
- Entity type and ID
- Action badge
- Details button

#### AuditLogDetailDialog.tsx
Modal dialog showing complete audit log details:
- All metadata fields
- Changes object (formatted JSON)
- IP address and user agent
- Color-coded action badges

### API Endpoints Used
- `POST /onerp/system/audit/logs` - Get audit logs with filters
- `POST /onerp/system/audit/entity-history` - Get entity history
- `POST /onerp/system/audit/report` - Generate audit report

### Server Actions
File: `application/use-cases/audit.actions.ts`

```typescript
getAuditLogs(filters: AuditFilters)
getEntityHistory(entityType: string, entityId: string)
getAuditReport(filters: AuditReportFilters)
```

## Shared Dependencies

### UI Components Used
All modules use existing shadcn/ui components:
- Button
- Input
- Select
- Dialog
- Badge
- Card
- Table
- Switch
- Progress
- ScrollArea
- Tooltip

### Utilities
- `@tanstack/react-query` for data fetching and caching
- `apiClient` from `@/lib/api` for authenticated API calls
- `auth` from `@/auth` for session management
- `toast` from `@/components/ui/use-toast` for notifications

## Toast Hook

Created a new toast hook at `/Users/carlosvelasco/Documents/carlos/nextjs/erp_project/src/components/ui/use-toast.ts` for showing notifications.

## Authentication Integration

All modules integrate with the existing authentication system:
- Access session data via `auth()` in server components
- Use `session?.company_id` for company context
- Use `session?.user?.id` for user context

## TypeScript Types

All modules have comprehensive TypeScript types defined in their respective `domain/entities/` directories:

### Preferences
- `PreferenceDefinition`
- `PreferenceValue`
- `PreferenceContext`
- `ResolvedPreference`

### Feature Flags
- `FeatureFlag`
- `CompanyFeatureFlag`
- `FeatureFlagStatus`

### Audit Logs
- `AuditLog`
- `AuditFilters`
- `AuditReportFilters`
- `AuditLogsPaginated`

## Usage

### Accessing the Modules

Navigate to:
- Preferences: `http://localhost:3000/dashboard/admin/preferences`
- Feature Flags: `http://localhost:3000/dashboard/admin/feature-flags`
- Audit Logs: `http://localhost:3000/dashboard/admin/audit-logs`

### Development

All modules are client-side interactive with server-side data fetching:
1. Server components fetch initial session data
2. Client components handle user interactions
3. React Query manages cache and state
4. Server actions handle API communication

### Testing

To test the modules:
1. Ensure the backend is running with the System module endpoints
2. Start the Next.js dev server: `npm run dev`
3. Navigate to the admin pages
4. Verify filters, search, and CRUD operations

## Future Enhancements

Potential improvements:
1. Export audit logs to CSV/Excel
2. Preference value history viewer
3. Feature flag scheduling
4. Bulk preference updates
5. Advanced audit log analytics
6. Real-time audit log streaming
7. Preference templates
8. Feature flag rollout strategies

## Notes

- All modules follow the existing codebase patterns
- Responsive design for mobile and desktop
- Proper error handling and loading states
- Optimistic updates for better UX
- Type-safe with TypeScript
- Accessible with proper ARIA labels
- Clean architecture with separation of concerns
