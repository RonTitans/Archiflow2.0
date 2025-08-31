import uuid
from django.db import models
from django.conf import settings

class Contact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contacts_created'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contacts_updated'
    )

    class Meta:
        db_table = 'contacts'
        ordering = ['-is_primary', 'name']

    def __str__(self):
        return f"{self.name} - {self.site.name}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            Contact.objects.filter(site=self.site, is_primary=True).exclude(id=self.id).update(is_primary=False)
        super().save(*args, **kwargs)


class ContactGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    contacts = models.ManyToManyField(Contact, related_name='groups', blank=True)
    email_list = models.TextField(blank=True, help_text='Additional email addresses, one per line')
    notification_types = models.JSONField(default=list, help_text='Types of notifications this group should receive')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contact_groups_created'
    )

    class Meta:
        db_table = 'contact_groups'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_all_emails(self):
        emails = []
        for contact in self.contacts.all():
            if contact.email:
                emails.append(contact.email)
        if self.email_list:
            emails.extend(self.email_list.strip().split('\n'))
        return list(set(emails))