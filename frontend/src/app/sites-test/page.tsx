'use client'

import React from 'react'
import SitesTable from '@/components/modules/sites/SitesTable'

export default function SitesTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-100">Sites Management</h1>
          <p className="text-gray-400 mt-1">Modern NetBox-style interface</p>
        </div>
        
        <SitesTable />
      </div>
    </div>
  )
}