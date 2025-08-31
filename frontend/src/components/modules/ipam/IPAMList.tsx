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
import { Plus, Search, Network } from 'lucide-react'
import { useSubnets } from '@/services/ipam'
import { Subnet } from '@/types/ipam'

export default function IPAMList() {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data: subnets = [], isLoading } = useSubnets()

  const filteredSubnets = subnets.filter((subnet: Subnet) =>
    subnet.cidr.toLowerCase().includes(search.toLowerCase()) ||
    subnet.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleRowClick = (id: string) => {
    router.push(`/ipam/${id}`)
  }

  const getUtilizationBadge = (used: number, total: number) => {
    const percentage = total > 0 ? (used / total) * 100 : 0
    let variant: 'default' | 'success' | 'warning' | 'destructive' = 'success'
    
    if (percentage > 90) variant = 'destructive'
    else if (percentage > 70) variant = 'warning'
    
    return (
      <Badge variant={variant}>
        {used}/{total} ({percentage.toFixed(0)}%)
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              {t('ipam.title')}
            </CardTitle>
            <Button onClick={() => router.push('/ipam/new')}>
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
                  <TableHead>{t('ipam.subnet')}</TableHead>
                  <TableHead>{t('ipam.vlan')}</TableHead>
                  <TableHead>{t('ipam.site')}</TableHead>
                  <TableHead>{t('ipam.description')}</TableHead>
                  <TableHead>{t('ipam.utilization')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredSubnets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubnets.map((subnet) => (
                    <TableRow
                      key={subnet.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(subnet.id)}
                    >
                      <TableCell className="font-medium">{subnet.cidr}</TableCell>
                      <TableCell>{subnet.vlan || '-'}</TableCell>
                      <TableCell>{subnet.site_name}</TableCell>
                      <TableCell>{subnet.description || '-'}</TableCell>
                      <TableCell>
                        {getUtilizationBadge(subnet.used_count || 0, subnet.ip_count || 0)}
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