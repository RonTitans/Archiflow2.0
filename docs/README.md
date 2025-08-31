# ArchiFlow Documentation

## Project Overview
ArchiFlow is a next-generation network management and IPAM/DCIM platform designed with modern architecture, compact UI, and full RTL support.

## Documentation Structure

- `/api` - REST API documentation and specifications
- `/schema` - Database schema diagrams and definitions  
- `/design` - UI/UX design guidelines and components
- `/architecture` - System architecture and technical decisions

## Core Modules

1. **Sites Management** - Central hub for infrastructure locations
2. **Equipment/Devices** - Asset and device tracking
3. **IP & DNS** - IPAM with subnet management and DNS zones
4. **Configurations** - Template-based config management
5. **Diagrams** - Visual network topology with draw.io
6. **Alerts** - Centralized alert management
7. **Contacts** - Site contact management
8. **System Management** - Users, roles, settings, audit

## Technical Stack

- **Database**: PostgreSQL with pgAdmin
- **Backend**: Django + Django REST Framework
- **Frontend**: React + Next.js (App Router) + Radix UI
- **State Management**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **Containerization**: Docker Compose
- **Languages**: Full RTL/LTR support (English/Hebrew)