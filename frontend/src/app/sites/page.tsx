'use client'

import React from 'react'
import AppLayout from '@/components/layout/AppLayout'
import SitesTable from '@/components/modules/sites/SitesTable'

export default function SitesPage() {
  return (
    <AppLayout>
      <SitesTable />
    </AppLayout>
  )
}