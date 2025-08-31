from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.sites.models import Site
from apps.contacts.models import Contact
from apps.equipment.models import Equipment, Rack
from apps.ipam.models import Subnet, IPAddress
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates sample data for development and testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create admin user if not exists
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@archiflow.com',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))
        
        # Create sample sites
        sites_data = [
            {
                'name': 'Main Data Center',
                'code': 'DC01',
                'address': '123 Tech Park, Silicon Valley, CA 94025',
                'status': 'active',
                'latitude': 37.4419,
                'longitude': -122.1430,
            },
            {
                'name': 'Branch Office NYC',
                'code': 'BR01',
                'address': '456 Broadway, New York, NY 10013',
                'status': 'active',
                'latitude': 40.7128,
                'longitude': -74.0060,
            },
            {
                'name': 'Disaster Recovery Site',
                'code': 'DR01',
                'address': '789 Backup Lane, Phoenix, AZ 85001',
                'status': 'active',
                'latitude': 33.4484,
                'longitude': -112.0740,
            },
            {
                'name': 'European Hub',
                'code': 'EU01',
                'address': 'Alexanderplatz 10, Berlin, Germany',
                'status': 'active',
                'latitude': 52.5200,
                'longitude': 13.4050,
            },
            {
                'name': 'Asia Pacific DC',
                'code': 'AP01',
                'address': '1 Raffles Place, Singapore',
                'status': 'planned',
                'latitude': 1.2847,
                'longitude': 103.8510,
            },
        ]
        
        for site_data in sites_data:
            site, created = Site.objects.get_or_create(
                code=site_data['code'],
                defaults={**site_data, 'created_by': admin_user}
            )
            if created:
                self.stdout.write(f'Created site: {site.name}')
                
                # Create contacts for each site
                contacts = [
                    Contact.objects.create(
                        site=site,
                        name=f'John Smith ({site.code})',
                        role='Site Manager',
                        phone=f'+1-555-{random.randint(1000, 9999)}',
                        email=f'john.smith@{site.code.lower()}.archiflow.com',
                        is_primary=True,
                        created_by=admin_user
                    ),
                    Contact.objects.create(
                        site=site,
                        name=f'Jane Doe ({site.code})',
                        role='Network Engineer',
                        phone=f'+1-555-{random.randint(1000, 9999)}',
                        email=f'jane.doe@{site.code.lower()}.archiflow.com',
                        created_by=admin_user
                    ),
                ]
                site.primary_contact = contacts[0]
                site.save()
                
                # Create racks for active sites
                if site.status == 'active':
                    for i in range(1, random.randint(3, 6)):
                        rack = Rack.objects.create(
                            site=site,
                            name=f'Rack-{site.code}-{i:02d}',
                            height=42
                        )
                        
                        # Create equipment in racks
                        equipment_types = [
                            ('Router', 'Cisco', 'ASR-1001'),
                            ('Switch', 'Arista', '7050SX'),
                            ('Firewall', 'Palo Alto', 'PA-5220'),
                            ('Server', 'Dell', 'PowerEdge R740'),
                            ('Storage', 'NetApp', 'FAS8200'),
                        ]
                        
                        for j in range(random.randint(2, 5)):
                            eq_type, manufacturer, model = random.choice(equipment_types)
                            Equipment.objects.create(
                                name=f'{site.code}-{eq_type}-{j+1:02d}',
                                type=eq_type,
                                manufacturer=manufacturer,
                                model=model,
                                serial_number=f'SN{site.code}{i:02d}{j:02d}',
                                status='active',
                                site=site,
                                rack=rack,
                                rack_position=j * 2 + 1,
                                created_by=admin_user
                            )
                
                # Create subnets for each site
                subnet_base = random.randint(1, 200)
                for vlan in [10, 20, 30]:
                    subnet = Subnet.objects.create(
                        cidr=f'10.{subnet_base}.{vlan}.0/24',
                        vlan_id=vlan,
                        purpose=f'VLAN {vlan} - {["Management", "Production", "Guest"][vlan//10 - 1]}',
                        site=site,
                        gateway=f'10.{subnet_base}.{vlan}.1',
                        dns_servers=[f'10.{subnet_base}.{vlan}.2', f'10.{subnet_base}.{vlan}.3'],
                        created_by=admin_user
                    )
                    
                    # Create some IP addresses
                    for ip_last_octet in range(10, 20):
                        ip = IPAddress.objects.create(
                            address=f'10.{subnet_base}.{vlan}.{ip_last_octet}',
                            subnet=subnet,
                            status=random.choice(['FREE', 'ASSIGNED', 'RESERVED']),
                            hostname=f'host-{site.code.lower()}-{vlan}-{ip_last_octet}' if random.random() > 0.5 else '',
                            created_at=site.created_at
                        )
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        
        # Print summary
        self.stdout.write('\nSummary:')
        self.stdout.write(f'Sites: {Site.objects.count()}')
        self.stdout.write(f'Contacts: {Contact.objects.count()}')
        self.stdout.write(f'Equipment: {Equipment.objects.count()}')
        self.stdout.write(f'Subnets: {Subnet.objects.count()}')
        self.stdout.write(f'IP Addresses: {IPAddress.objects.count()}')