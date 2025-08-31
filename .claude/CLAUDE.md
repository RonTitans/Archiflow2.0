# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL - READ FIRST

### Before Starting ANY Module Development:
1. **Read the User Story**: Check `F:\ArchiFlow\UserStory` to understand the business logic and requirements
2. **Follow the Design System**: Use `F:\ArchiFlow\DESIGN_SYSTEM.md` as your blueprint for ALL UI implementation
3. **Test in Browser**: Always verify your work visually before declaring completion
4. **Maintain Consistency**: Every module must look like part of the same unified system

## ArchiFlow Overview

ArchiFlow is a professional network management and IPAM/DCIM platform inspired by NetBox. The system features:
- **Unified Design System**: Clean, modern interface with consistent patterns across all modules
- **NetBox-style Interactive Tables**: Every row is clickable for drill-down navigation
- **Professional Enterprise UI**: Light theme with sky blue accents and subtle gray borders
- **Modular Architecture**: Each module (Sites, Equipment, IPAM, etc.) follows the same patterns

## 🎨 Design System Implementation

### MANDATORY - Follow These Rules:
1. **Use AppLayout** for ALL pages - Never create duplicate layouts
2. **Follow the Color Palette**:
   - Primary: `#0ea5e9` (Sky blue)
   - Borders: `#e2e8f0` (Light gray)
   - Background: `#f8fafc` (Page backgrounds)
   - Text: `#1e293b` (Headers), `#64748b` (Labels)
3. **Form Styling**: Use inline styles with modern inputs (see DESIGN_SYSTEM.md)
4. **Modal Behavior**: Fixed size, no jumping when switching tabs
5. **Table Design**: White background, clickable rows, action buttons in header

## Module Development Workflow

### Step-by-Step Process for New Modules:
1. **Read User Story** for the module in `F:\ArchiFlow\UserStory`
2. **Create List Page** using AppLayout wrapper
3. **Implement Table** with clickable rows following Sites module pattern
4. **Create Detail Page** with breadcrumb navigation and tabs
5. **Build Form Modal** with modern styled inputs (NO shadcn defaults)
6. **Test Everything** in browser - verify styling matches Sites module
7. **Check Console** for any errors before completion

### Example Module Structure:
```
app/[module-name]/
├── page.tsx                    # List view with table
└── [id]/
    └── page.tsx               # Detail view with tabs

components/modules/[module-name]/
├── [ModuleName]Table.tsx     # Table component
└── [ModuleName]FormModal.tsx # Add/Edit modal
```

## Development Commands

### Full Stack Development (Docker)
```bash
# Start all services (recommended for development)
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Reset database
docker-compose down -v
docker-compose up -d
```

### Backend Commands
```bash
# Django migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run tests
docker-compose exec backend python manage.py test apps.sites.tests
docker-compose exec backend python manage.py test

# Django shell
docker-compose exec backend python manage.py shell

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

### Frontend Commands
```bash
# Install dependencies (if working locally)
cd frontend && npm install

# Development server
cd frontend && npm run dev

# Build production
cd frontend && npm run build

# Lint
cd frontend && npm run lint

# Type checking
cd frontend && npx tsc --noEmit
```

### Database Access
```bash
# Direct PostgreSQL access
docker-compose exec postgres psql -U archiflow -d archiflow

# pgAdmin web interface
# URL: http://localhost:5050
# Login: admin@archiflow.local / pgadmin_pass_2024
```

## Architecture & Core Patterns

### Database Architecture
The system uses PostgreSQL with specialized network data types:
- **CIDR fields** for subnet storage with GIST indexing
- **INET fields** for IP addresses with btree indexing  
- **MACADDR** for MAC addresses
- **JSONB** for flexible configurations and audit logs
- All primary keys are UUIDs for distributed compatibility

### Django Apps Structure
Each Django app in `backend/apps/` follows this pattern:
1. **models.py** - Database models with audit fields (created_at, updated_at, created_by, updated_by)
2. **serializers.py** - DRF serializers with nested relationships
3. **views.py** - ViewSets with pagination, filtering, and permissions
4. **urls.py** - URL routing following `/api/v1/{module}/` pattern
5. **filters.py** - Django-filter FilterSets for advanced querying
6. **permissions.py** - Custom permission classes for RBAC

### Frontend Architecture
The frontend uses Next.js 14 App Router with:
- **Providers Pattern**: All providers wrapped in `src/app/providers.tsx`
- **Module-based Structure**: Each core module in `src/components/modules/{module}/`
- **RTL/LTR Support**: Direction provider controls UI mirroring
- **Interactive Tables**: All tables are clickable for drill-down navigation (NetBox-style)

### Key Design Decisions

1. **NetBox-Style Navigation**: Every table row is clickable and navigates to a detail view. This is fundamental to the UX.

2. **Consistent Spacing**: 1.5rem padding for main content areas

3. **Full Screen Design**: No black borders or margins anywhere

4. **Status Management**: All entities have status enums with color-coded badges

5. **Audit Everything**: Every model change is logged with user, timestamp, and before/after values

## API Patterns

### Authentication
JWT-based with refresh tokens:
```
POST /api/v1/auth/login/ -> access & refresh tokens
POST /api/v1/auth/refresh/ -> new access token
POST /api/v1/auth/logout/ -> blacklist refresh token
```

### Standard REST Endpoints
Each module follows:
```
GET    /api/v1/{module}/          # List with pagination
POST   /api/v1/{module}/          # Create
GET    /api/v1/{module}/{id}/     # Retrieve
PUT    /api/v1/{module}/{id}/     # Update
PATCH  /api/v1/{module}/{id}/     # Partial update
DELETE /api/v1/{module}/{id}/     # Delete
```

### IPAM-Specific Operations
```
POST /api/v1/ipam/allocate/       # Allocate next available IP
POST /api/v1/ipam/release/{id}/   # Release IP back to pool
POST /api/v1/ipam/check-conflict/ # Check for IP conflicts
```

## Critical Implementation Notes

### UI/UX Requirements:
- **Full Screen Design**: No black borders or margins
- **Sidebar**: Fixed 260px width, dark theme (#1e293b)
- **Side-by-Side Layout**: Sidebar beside content, never stacked
- **Consistent Spacing**: 1.5rem padding for main content areas
- **Professional Appearance**: This is enterprise software - maintain high standards

### When Adding New Features

1. **Check User Story First**: Understand requirements before coding
2. **Follow Design Patterns**: Use existing Sites module as reference
3. **Database Changes**: Always create migrations, never modify existing ones
4. **API Versioning**: New endpoints go in v1 unless breaking changes require v2
5. **Frontend State**: Use TanStack Query for server state, Zustand for client state
6. **Form Components**: Use FormProvider from react-hook-form, NOT custom Form components
7. **Translations**: Add keys to both `locales/en/common.json` and `locales/he/common.json`
8. **Status Colors**: Follow the established palette:
   - Active: `#10b981` (Green)
   - Inactive: `#6b7280` (Gray)
   - Pending: `#f59e0b` (Amber)
   - Error: `#ef4444` (Red)

### IP Address Management
- IP allocation must check subnet boundaries
- MAC addresses stored in lowercase with colons (aa:bb:cc:dd:ee:ff)
- Conflict detection runs before any IP assignment
- All IP operations create audit log entries

### Configuration Templates
Templates use Jinja2 syntax with `{{variable}}` placeholders. Variables are validated against the schema before rendering.

### Draw.io Integration
Diagrams are stored as JSON in the database with versioning. The frontend embeds draw.io editor for visual network topology editing.

## Common Mistakes to Avoid

### ❌ DON'T:
- Use dark themes for main content areas
- Mix Tailwind classes with critical inline styles
- Use shadcn/ui components without restyling
- Let modals resize when content changes
- Create duplicate layout components
- Use empty string values in Select components
- Declare completion without browser testing

### ✅ DO:
- Use inline styles for critical layout components
- Test everything in the browser
- Maintain full-screen design
- Keep sidebar fixed at 260px
- Follow the color palette religiously
- Check UserStory before implementing
- Reference DESIGN_SYSTEM.md constantly

## Service URLs

Development environment:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- pgAdmin: http://localhost:5050
- API Documentation: http://localhost:8000/swagger/
- Redis: localhost:6379

## Environment Variables

Critical environment variables that must be set:
- `DATABASE_HOST`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`
- `SECRET_KEY` (change in production)
- `NEXT_PUBLIC_API_URL` (frontend API endpoint)
- `CORS_ALLOWED_ORIGINS` (comma-separated list)

See `.env.example` for complete list.

## Quick Reference Files

### Essential Documents:
- `F:\ArchiFlow\UserStory` - Business logic and requirements for each module
- `F:\ArchiFlow\DESIGN_SYSTEM.md` - UI/UX patterns and component guidelines
- `F:\ArchiFlow\frontend\src\app\sites\` - Reference implementation
- `F:\ArchiFlow\frontend\src\components\modules\sites\` - Component patterns

### When Starting Work:
1. Read this file (CLAUDE.md)
2. Check UserStory for module requirements
3. Review DESIGN_SYSTEM.md for UI patterns
4. Reference Sites module for implementation examples
5. Build consistently, test thoroughly

## Important Reminders

- **Consistency is Key**: Every module should look identical in style
- **User Story Driven**: Always check requirements before implementing
- **Design System First**: Follow patterns, don't create new ones
- **Test Visually**: Code review isn't enough - see it in browser
- **Professional Quality**: This is enterprise software for network management