'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Search, Plus, Upload, Download, Settings,
  Edit, Trash2, Filter, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Site } from '@/types/sites'
import { useSites, deleteSite, bulkDeleteSites, exportSites } from '@/services/sites'
import { useToast } from '@/components/ui/use-toast'
import SiteFormModal from './SiteFormModal'
import '../../../styles/clean-table.css'

const SitesTable: React.FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { data, isLoading, refetch } = useSites()
  
  // State
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(25)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  // Filtered data
  const filteredData = useMemo(() => {
    if (!data?.results) return []
    
    let filtered = data.results
    
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(site => 
        site.name.toLowerCase().includes(searchLower) ||
        site.code.toLowerCase().includes(searchLower) ||
        site.city?.toLowerCase().includes(searchLower)
      )
    }
    
    return filtered
  }, [data, search])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredData.slice(start, end)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedData.map(site => site.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleRowClick = (site: Site) => {
    router.push(`/sites/${site.id}`)
  }

  const handleEdit = (e: React.MouseEvent, site: Site) => {
    e.stopPropagation()
    setEditingSite(site)
    setIsFormOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent, site: Site) => {
    e.stopPropagation()
    if (confirm(`Delete site ${site.name}?`)) {
      try {
        await deleteSite(site.id)
        toast({ title: 'Site deleted successfully' })
        refetch()
      } catch (error) {
        toast({ title: 'Failed to delete site', variant: 'destructive' })
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    
    if (confirm(`Delete ${selectedIds.size} sites?`)) {
      try {
        await bulkDeleteSites(Array.from(selectedIds))
        toast({ title: 'Sites deleted successfully' })
        setSelectedIds(new Set())
        refetch()
      } catch (error) {
        toast({ title: 'Failed to delete sites', variant: 'destructive' })
      }
    }
  }

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'active': return 'active'
      case 'planned': return 'planned'
      case 'staging': return 'planned'
      default: return 'inactive'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
          <p className="text-gray-600">Manage your network locations and facilities</p>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Toolbar */}
          <div className="table-toolbar">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sites..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input pl-10"
                />
              </div>
              <button className="btn btn-primary">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingSite(null)
                  setIsFormOpen(true)
                }}
                className="btn btn-success"
              >
                <Plus className="h-4 w-4" />
                Add Site
              </button>
              <button className="btn btn-primary">
                <Upload className="h-4 w-4" />
                Import
              </button>
              <button 
                onClick={() => exportSites({})}
                className="btn btn-warning"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="clean-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <Checkbox
                    checked={selectedIds.size === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Status</th>
                <th>City</th>
                <th>Region</th>
                <th>Group</th>
                <th>Tenant</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    Loading sites...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    No sites found
                  </td>
                </tr>
              ) : (
                paginatedData.map((site) => (
                  <tr key={site.id} onClick={() => handleRowClick(site)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(site.id)}
                        onCheckedChange={(checked) => handleSelectOne(site.id, checked as boolean)}
                      />
                    </td>
                    <td>
                      <div className="font-medium">{site.name}</div>
                      <div className="text-xs text-gray-500">{site.code}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(site.status)}`}>
                        {site.status}
                      </span>
                    </td>
                    <td className="text-gray-600">{site.city || '—'}</td>
                    <td className="text-gray-600">{site.region_display || '—'}</td>
                    <td className="text-gray-600">{site.group_display || '—'}</td>
                    <td className="text-gray-600">{site.tenant_name || '—'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={(e) => handleEdit(e, site)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={(e) => handleDelete(e, site)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Footer */}
          <div className="table-footer">
            <div className="flex items-center gap-4">
              {selectedIds.size > 0 && (
                <>
                  <span>{selectedIds.size} selected</span>
                  <button onClick={handleBulkDelete} className="btn btn-danger">
                    Delete Selected
                  </button>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span>
                Showing {((currentPage - 1) * itemsPerPage) + 1}-
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="action-btn"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="action-btn"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
            <span className="text-blue-700">
              {selectedIds.size} sites selected
            </span>
            <div className="flex gap-2">
              <button className="btn btn-warning">Edit Selected</button>
              <button onClick={handleBulkDelete} className="btn btn-danger">
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <SiteFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingSite(null)
        }}
        site={editingSite}
        onSuccess={() => {
          setIsFormOpen(false)
          setEditingSite(null)
          refetch()
        }}
      />
    </div>
  )
}

export default SitesTable