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
import { Plus, Search, Globe } from 'lucide-react'
import { useDNSZones } from '@/services/dns'
import { DNSZone } from '@/types/dns'

export default function DNSList() {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data: zones = [], isLoading } = useDNSZones()

  const filteredZones = zones.filter((zone: DNSZone) =>
    zone.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRowClick = (id: string) => {
    router.push(`/dns/${id}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('dns.title')}
            </CardTitle>
            <Button onClick={() => router.push('/dns/new')}>
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
                  <TableHead>{t('dns.zone')}</TableHead>
                  <TableHead>{t('dns.type')}</TableHead>
                  <TableHead>{t('dns.records')}</TableHead>
                  <TableHead>{t('dns.description')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredZones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredZones.map((zone) => (
                    <TableRow
                      key={zone.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(zone.id)}
                    >
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{zone.type}</Badge>
                      </TableCell>
                      <TableCell>{zone.record_count || 0}</TableCell>
                      <TableCell>{zone.description || '-'}</TableCell>
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