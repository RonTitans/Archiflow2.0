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
import { Plus, Search, AlertTriangle } from 'lucide-react'
import { useAlerts } from '@/services/alerts'
import { Alert } from '@/types/alerts'

export default function AlertsList() {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data: alerts = [], isLoading } = useAlerts()

  const filteredAlerts = alerts.filter((alert: Alert) =>
    alert.message.toLowerCase().includes(search.toLowerCase()) ||
    alert.source?.toLowerCase().includes(search.toLowerCase())
  )

  const handleRowClick = (id: string) => {
    router.push(`/alerts/${id}`)
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
      low: 'default',
      medium: 'warning',
      high: 'destructive',
      critical: 'destructive',
    }
    return <Badge variant={variants[severity] || 'default'}>{severity}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
      new: 'destructive',
      acknowledged: 'warning',
      resolved: 'success',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t('alerts.title')}
            </CardTitle>
            <Button onClick={() => router.push('/alerts/rules')}>
              {t('alerts.manageRules')}
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
                  <TableHead>{t('alerts.severity')}</TableHead>
                  <TableHead>{t('alerts.status')}</TableHead>
                  <TableHead>{t('alerts.message')}</TableHead>
                  <TableHead>{t('alerts.source')}</TableHead>
                  <TableHead>{t('alerts.time')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert) => (
                    <TableRow
                      key={alert.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(alert.id)}
                    >
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                      <TableCell className="font-medium">{alert.message}</TableCell>
                      <TableCell>{alert.source || '-'}</TableCell>
                      <TableCell>{new Date(alert.created_at).toLocaleString()}</TableCell>
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