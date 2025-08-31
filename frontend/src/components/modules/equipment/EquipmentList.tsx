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
import { Plus, Search, Server } from 'lucide-react'
import { useEquipment } from '@/services/equipment'
import { Equipment } from '@/types/equipment'

export default function EquipmentList() {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data: equipment = [], isLoading } = useEquipment()

  const filteredEquipment = equipment.filter((item: Equipment) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.serial_number?.toLowerCase().includes(search.toLowerCase())
  )

  const handleRowClick = (id: string) => {
    router.push(`/equipment/${id}`)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
      active: 'success',
      inactive: 'default',
      maintenance: 'warning',
      decommissioned: 'destructive',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              {t('equipment.title')}
            </CardTitle>
            <Button onClick={() => router.push('/equipment/new')}>
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
                  <TableHead>{t('equipment.name')}</TableHead>
                  <TableHead>{t('equipment.type')}</TableHead>
                  <TableHead>{t('equipment.manufacturer')}</TableHead>
                  <TableHead>{t('equipment.model')}</TableHead>
                  <TableHead>{t('equipment.serial')}</TableHead>
                  <TableHead>{t('equipment.site')}</TableHead>
                  <TableHead>{t('equipment.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredEquipment.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipment.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(item.id)}
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.device_type}</TableCell>
                      <TableCell>{item.manufacturer}</TableCell>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.serial_number}</TableCell>
                      <TableCell>{item.site_name}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
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