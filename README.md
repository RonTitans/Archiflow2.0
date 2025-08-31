# ArchiFlow - Network Management & IPAM/DCIM Platform

ArchiFlow is a next-generation network management platform combining IPAM (IP Address Management) and DCIM (Data Center Infrastructure Management) capabilities with modern architecture, compact UI design, and full RTL support.

## 🚀 Features

### Core Modules
- **Sites Management** - Central hub for infrastructure locations with contacts, equipment, and network resources
- **Equipment Tracking** - Comprehensive device and asset management with interface tracking
- **IP Management (IPAM)** - Subnet allocation, IP assignment, conflict detection, and usage tracking  
- **DNS Management** - Zone management with DNSSEC support and record validation
- **Configuration Templates** - Reusable config templates with variable substitution
- **Network Diagrams** - Interactive visual topology with draw.io integration
- **Alerts System** - Centralized alert management with severity levels
- **Contacts** - Site-based contact management with primary contact designation

### Technical Features
- **Full RTL/LTR Support** - Seamless switching between English and Hebrew
- **Dark/Light Mode** - Theme switching with system preference support
- **Interactive Tables** - NetBox-style clickable rows for drill-down navigation
- **Audit Logging** - Complete history tracking for all changes
- **RBAC** - Role-based access control for security
- **REST API** - Versioned API with OpenAPI documentation

## 🛠️ Technology Stack

### Backend
- **Django 4.2** + Django REST Framework
- **PostgreSQL 15** - Primary database with CIDR/INET support
- **Redis** - Caching and Celery broker
- **Celery** - Async task processing

### Frontend  
- **React 18** + Next.js 14 (App Router)
- **TypeScript** - Type safety
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Data fetching and caching
- **React Hook Form + Zod** - Form handling and validation
- **Tailwind CSS** - Styling with RTL support

### DevOps
- **Docker Compose** - Development environment
- **pgAdmin** - Database visual management
- **Nginx** - Production web server
- **GitHub Actions** - CI/CD pipeline

## 📦 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/archiflow.git
cd archiflow
\`\`\`

2. Start the development environment:
\`\`\`bash
docker-compose up -d
\`\`\`

3. Access the services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **pgAdmin**: http://localhost:5050
  - Email: admin@archiflow.local
  - Password: pgadmin_pass_2024
- **API Documentation**: http://localhost:8000/swagger/

### Default Credentials
- **Admin User**: admin / admin123
- **Database**: archiflow / archiflow_secure_pass_2024

## 🏗️ Project Structure

\`\`\`
ArchiFlow/
├── backend/                 # Django backend
│   ├── apps/               # Django apps
│   │   ├── sites/         # Sites management
│   │   ├── equipment/     # Equipment tracking
│   │   ├── ipam/          # IP address management
│   │   ├── dns/           # DNS management
│   │   ├── configurations/ # Config templates
│   │   ├── diagrams/      # Network diagrams
│   │   ├── alerts/        # Alert system
│   │   ├── contacts/      # Contact management
│   │   ├── users/         # User management
│   │   └── audit/         # Audit logging
│   └── archiflow/         # Django project settings
├── frontend/              # React/Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   └── locales/      # i18n translations
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── schema/           # Database schema
│   ├── design/           # UI/UX guidelines
│   └── architecture/     # System architecture
└── docker-compose.yml    # Docker services
\`\`\`

## 🔧 Development

### Backend Development
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\`\`\`

### Frontend Development
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Running Tests
\`\`\`bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm run test
\`\`\`

## 📊 Database Schema

The database uses PostgreSQL with specialized types for network data:
- CIDR fields for subnet storage
- INET fields for IP addresses
- MACADDR for MAC addresses
- JSONB for flexible configuration storage
- Full-text search indexes for performance

See `/docs/schema/database-schema.md` for complete schema documentation.

## 🌐 API Documentation

The REST API follows RESTful principles with:
- Versioned endpoints (`/api/v1/`)
- JWT authentication
- Pagination and filtering
- OpenAPI/Swagger documentation

Access the interactive API docs at http://localhost:8000/swagger/

## 🎨 UI/UX Design Principles

- **Compact Design** - Optimized for information density
- **Interactive Tables** - Click any row for details (NetBox-style)
- **Quick Actions** - Common tasks always accessible
- **Status Indicators** - Color-coded chips for quick status recognition
- **RTL/LTR Support** - Full bidirectional text support
- **Responsive** - Works on desktop and tablet devices

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Audit logging for all changes
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS enforced in production

## 📈 Performance

- PostgreSQL indexes on frequently queried fields
- Redis caching for read-heavy operations
- React Query for intelligent client-side caching
- Lazy loading and code splitting
- Optimized Docker images for production

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the Commercial License - see the LICENSE file for details.

## 🆘 Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@archiflow.com

## 🚦 Status

- Backend: ✅ Core modules implemented
- Frontend: ✅ Base UI with RTL support
- Database: ✅ Schema defined with pgAdmin integration
- Docker: ✅ Development environment ready
- Production: 🚧 In progress

---

Built with ❤️ for modern network infrastructure management