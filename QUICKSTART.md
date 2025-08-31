# ArchiFlow Quick Start Guide

## 🚀 Your Development Environment is Ready!

### ✅ What's Working Now:

1. **Backend API** - http://localhost:8000
   - Sites API endpoints with CRUD operations
   - JWT authentication configured
   - Sample data loaded (5 sites, 50 equipment, 150 IPs)
   - Swagger documentation at http://localhost:8000/swagger/

2. **Frontend** - http://localhost:3000
   - Basic React/Next.js structure
   - RTL/LTR support (English/Hebrew)
   - Dark/Light theme toggle
   - Component structure ready

3. **Database** - PostgreSQL with pgAdmin
   - All models created and migrated
   - Sample data loaded
   - pgAdmin at http://localhost:5050

## 📋 Next Development Steps

### Step 1: Test the API (5 minutes)
```bash
# Get JWT token
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Copy the "access" token and use it:
curl http://localhost:8000/api/v1/sites/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Or simply:
1. Go to http://localhost:8000/swagger/
2. Click "Authorize" button
3. Enter: `Bearer <your-access-token>`
4. Test all endpoints interactively!

### Step 2: Build the Frontend Components (1-2 hours)

Create these reusable components first:

#### 1. Interactive Table Component
```typescript
// src/components/ui/data-table.tsx
- Clickable rows (NetBox style)
- Sorting headers
- Pagination
- Search/filter
- Status chips
```

#### 2. Form Components
```typescript
// src/components/ui/form/
- Input with validation
- Select dropdown
- Textarea
- Form wrapper with React Hook Form
```

#### 3. Layout Components
```typescript
// src/components/layout/
- Page header with breadcrumbs
- Tab navigation
- Quick actions bar
- KPI cards
```

### Step 3: Implement Sites Module UI (2-3 hours)

#### Sites List Page
```typescript
// src/app/sites/page.tsx
- Fetch sites from API
- Display in interactive table
- Add/Edit/Delete buttons
- Search and filters
- Click row → navigate to detail
```

#### Site Detail Page
```typescript
// src/app/sites/[id]/page.tsx
- Tabs: Overview, Equipment, IP & DNS, Contacts
- KPI cards at top
- Quick actions
- Edit mode
```

### Step 4: Add Authentication (1 hour)

#### Login Page
```typescript
// src/app/auth/login/page.tsx
- JWT token storage
- Protected routes
- Auto-refresh tokens
- Logout functionality
```

## 🛠️ Development Tips

### API Testing with Swagger
1. Go to: http://localhost:8000/swagger/
2. Test all endpoints interactively
3. See request/response formats
4. Copy working requests

### Frontend Development
```bash
# Watch for changes
docker logs -f archiflow-frontend

# Install new packages
docker exec archiflow-frontend npm install package-name

# Type checking
docker exec archiflow-frontend npx tsc --noEmit
```

### Backend Development
```bash
# Django shell for testing
docker exec -it archiflow-backend python manage.py shell

# Create more sample data
docker exec archiflow-backend python manage.py create_sample_data

# Check API endpoints
docker exec archiflow-backend python manage.py show_urls
```

## 📦 Sample Data Available

You have pre-loaded data to work with:

- **5 Sites**: DC01, BR01, DR01, EU01, AP01
- **10 Contacts**: 2 per site
- **50 Equipment**: Routers, switches, servers
- **15 Subnets**: 3 VLANs per site
- **150 IP Addresses**: Mix of FREE, ASSIGNED, RESERVED

## 🔍 Quick Checks

### Check if everything is running:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### View Django Admin:
1. http://localhost:8000/admin/
2. Login: admin / admin123
3. See all data models

### View Database in pgAdmin:
1. http://localhost:5050
2. Login: admin@archiflow.com / pgadmin_pass_2024
3. Connect with password: archiflow_secure_pass_2024

## 💡 Architecture Reminders

### API Pattern
```
GET    /api/v1/sites/          # List all
POST   /api/v1/sites/          # Create new
GET    /api/v1/sites/{id}/     # Get one
PUT    /api/v1/sites/{id}/     # Update
DELETE /api/v1/sites/{id}/     # Delete
GET    /api/v1/sites/stats/    # Statistics
```

### Frontend State Management
- **Server state**: TanStack Query (React Query)
- **Client state**: Zustand or Context
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table

### Component Structure
```
src/
├── app/              # Next.js pages
├── components/
│   ├── ui/          # Reusable components
│   ├── layout/      # Layout components
│   └── modules/     # Feature modules
├── hooks/           # Custom hooks
├── lib/             # Utilities
└── services/        # API services
```

## 🚦 Ready to Code!

1. **Start with the UI components** - They're reusable everywhere
2. **Then build the Sites module** - It's the template for all others
3. **Add authentication** - Secure everything
4. **Iterate and improve** - Add features as you go

The foundation is solid. Now build something amazing! 🚀