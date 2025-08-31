'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Users } from 'lucide-react'
import { useContacts } from '@/services/contacts'
import { Contact } from '@/types/contacts'

export default function ContactsList() {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data: contacts = [], isLoading } = useContacts()

  const filteredContacts = contacts.filter((contact: Contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email?.toLowerCase().includes(search.toLowerCase()) ||
    contact.role?.toLowerCase().includes(search.toLowerCase())
  )

  const handleRowClick = (id: string) => {
    router.push(`/contacts/${id}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('contacts.title')}
            </CardTitle>
            <Button onClick={() => router.push('/contacts/new')}>
              <Plus className="h-4 w-4 mr-2" />
              {t('common.add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('contacts.name')}</TableHead>
                  <TableHead>{t('contacts.email')}</TableHead>
                  <TableHead>{t('contacts.phone')}</TableHead>
                  <TableHead>{t('contacts.role')}</TableHead>
                  <TableHead>{t('contacts.group')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(contact.id)}
                    >
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email || '-'}</TableCell>
                      <TableCell>{contact.phone || '-'}</TableCell>
                      <TableCell>{contact.role || '-'}</TableCell>
                      <TableCell>
                        {contact.group_name ? (
                          <Badge variant="outline">{contact.group_name}</Badge>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}