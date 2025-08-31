import uuid
from django.db import models
from django.conf import settings

class Diagram(models.Model):
    DIAGRAM_TYPES = [
        ('network', 'Network'),
        ('rack', 'Rack'),
        ('logical', 'Logical'),
        ('physical', 'Physical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(max_length=20, choices=DIAGRAM_TYPES, default='network')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'diagrams'
        ordering = ['name']

    def __str__(self):
        return self.name

class DiagramVersion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    diagram = models.ForeignKey(Diagram, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField()
    content = models.JSONField(default=dict)
    svg_export = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'diagram_versions'
        ordering = ['diagram', '-version_number']
        unique_together = [['diagram', 'version_number']]

    def __str__(self):
        return f"{self.diagram.name} v{self.version_number}"