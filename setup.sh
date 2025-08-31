#!/bin/bash

echo "🚀 ArchiFlow Setup Script"
echo "========================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"

# Stop any existing containers
echo "🔄 Stopping any existing containers..."
docker-compose down

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Create admin user if it doesn't exist
echo "👤 Setting up admin user..."
docker-compose exec -T backend python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@archiflow.local', 'admin123')
    print('Admin user created!')
else:
    print('Admin user already exists!')
EOF

# Add sample sites if database is empty
echo "📍 Checking for sample data..."
docker-compose exec -T postgres psql -U archiflow -d archiflow -c "SELECT COUNT(*) FROM sites;" | grep -q " 0" && {
    echo "Adding sample sites..."
    docker-compose exec -T postgres psql -U archiflow -d archiflow << 'EOF'
INSERT INTO sites (id, name, code, address, city, state_province, country, postal_code, status, description, physical_address, shipping_address, region, "group", time_zone, facility_id, comments, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'New York Data Center', 'NYC-DC01', '123 Tech Park Ave', 'New York', 'NY', 'United States', '10001', 'active', 'Primary East Coast data center facility with full redundancy', '123 Tech Park Ave, New York, NY 10001', '123 Tech Park Ave, Loading Dock B, New York, NY 10001', 'north-america', 'production', 'America/New_York', 'NYC-001', 'Main production facility', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Los Angeles Hub', 'LAX-HUB01', '456 Network Blvd', 'Los Angeles', 'CA', 'United States', '90001', 'active', 'West Coast network operations center and peering facility', '456 Network Blvd, Los Angeles, CA 90001', '456 Network Blvd, Receiving Dept, Los Angeles, CA 90001', 'north-america', 'production', 'America/Los_Angeles', 'LAX-001', 'Major west coast hub', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Chicago Edge Site', 'CHI-EDGE01', '789 Loop Center', 'Chicago', 'IL', 'United States', '60601', 'active', 'Midwest edge computing and content delivery facility', '789 Loop Center, Chicago, IL 60601', '789 Loop Center, Dock 3, Chicago, IL 60601', 'north-america', 'edge', 'America/Chicago', 'CHI-001', 'Edge computing site', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Dallas Branch', 'DAL-BR01', '321 Tech Plaza', 'Dallas', 'TX', 'United States', '75201', 'planned', 'Southern regional office with server room', '321 Tech Plaza, Dallas, TX 75201', '321 Tech Plaza, Suite 100, Dallas, TX 75201', 'north-america', 'branch', 'America/Chicago', 'DAL-001', 'Future expansion site', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Miami DR Site', 'MIA-DR01', '654 Recovery Way', 'Miami', 'FL', 'United States', '33101', 'active', 'Disaster recovery and backup facility', '654 Recovery Way, Miami, FL 33101', '654 Recovery Way, Building C, Miami, FL 33101', 'north-america', 'disaster-recovery', 'America/New_York', 'MIA-001', 'DR site with full replication', NOW(), NOW());
EOF
    echo "✅ Sample sites added!"
} || echo "✅ Sites already exist in database"

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "🌐 Access URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs:    http://localhost:8000/swagger/"
echo "   pgAdmin:     http://localhost:5050"
echo ""
echo "🔑 Login Credentials:"
echo "   App:     admin / admin123"
echo "   pgAdmin: admin@admin.com / admin"
echo ""
echo "📝 Useful Commands:"
echo "   View logs:        docker-compose logs -f [service]"
echo "   Stop services:    docker-compose down"
echo "   Restart service:  docker-compose restart [service]"
echo ""