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
import { Plus, Search, FileCode } from 'lucide-react'
import { useConfigTemplates } from '@/services/configurations'
import { ConfigTemplate } from '@/types/configurations'

export default function ConfigurationsList() {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data: templates = [], isLoading } = useConfigTemplates()

  const filteredTemplates = templates.filter((template: ConfigTemplate) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRowClick = (id: string) => {
    router.push(`/configurations/${id}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              {t('configurations.title')}
            </CardTitle>
            <Button onClick={() => router.push('/configurations/new')}>
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
                  <TableHead>{t('configurations.template')}</TableHead>
                  <TableHead>{t('configurations.deviceType')}</TableHead>
                  <TableHead>{t('configurations.backups')}</TableHead>
                  <TableHead>{t('configurations.description')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTemplates.map((template) => (
                    <TableRow
                      key={template.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(template.id)}
                    >
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.device_type}</Badge>
                      </TableCell>
                      <TableCell>{template.backup_count || 0}</TableCell>
                      <TableCell>{template.description || '-'}</TableCell>
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