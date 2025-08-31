# ArchiFlow Design System Documentation
*Created: November 27, 2024*
*Last Updated: November 27, 2024*

## Executive Summary
This document captures the design system and implementation patterns established during the development of the Sites module. These patterns should be followed for all future modules to ensure a unified, professional system design.

---

## 🎯 Core Design Principles

### 1. NetBox-Inspired Professional Design
- **Clean, light theme** - White backgrounds with subtle gray accents
- **Consistent spacing** - 1.5rem padding for main content areas
- **Professional color palette**:
  - Primary: `#0ea5e9` (Sky blue for actions)
  - Borders: `#e2e8f0` (Light gray)
  - Text: `#1e293b` (Dark gray for headers), `#64748b` (Medium gray for labels)
  - Background: `#f8fafc` (Very light gray for page backgrounds)
  - White: `#ffffff` (For cards and modals)

### 2. Layout Structure
- **Fixed sidebar** (260px width) with dark theme (`#1e293b`)
- **Full-screen design** - No margins or black borders
- **Side-by-side layout** - Sidebar beside content, never stacked
- **Responsive but desktop-first** - Optimized for professional use

---

## 🏗️ Component Architecture

### AppLayout Component
The master layout that wraps all pages:

```jsx
// Key structure:
<div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
  {/* Sidebar - Fixed width */}
  <div style={{ width: '260px', backgroundColor: '#1e293b' }}>
    {/* Logo, Navigation, Footer */}
  </div>
  
  {/* Main Content Area */}
  <div style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    {/* Header */}
    <header style={{ height: '64px', backgroundColor: 'white' }}>
      {/* Search, User Menu, Notifications */}
    </header>
    
    {/* Page Content */}
    <main style={{ flex: 1, overflowY: 'auto' }}>
      {children}
    </main>
  </div>
</div>
```

### Page Structure Pattern
Every page should follow this structure:

```jsx
export default function ModulePage() {
  return (
    <AppLayout>
      <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100%' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>
            Module Name
          </h1>
        </div>
        
        {/* Content */}
        {/* Your module content here */}
      </div>
    </AppLayout>
  )
}
```

---

## 📊 Table Design Pattern

### Key Features
- **Clean white background** with subtle borders
- **Clickable rows** - Every row navigates to detail view
- **Action buttons** - Import, Export, Add buttons in header
- **Consistent height** - 44px for rows

### Implementation Example
```jsx
// Table container
<div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
  
  // Table header with actions
  <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
    <h2>Items</h2>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button>Add New</button>
      <button>Import</button>
      <button>Export</button>
    </div>
  </div>
  
  // Table
  <table style={{ width: '100%' }}>
    <thead style={{ backgroundColor: '#f8fafc' }}>
      {/* Headers */}
    </thead>
    <tbody>
      <tr onClick={() => navigate('/detail')} style={{ cursor: 'pointer' }}>
        {/* Clickable row content */}
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🔲 Modal Design Pattern

### Structure
Modals should be **centered overlays** with consistent sizing:

```jsx
// Modal container
<div style={{
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  // Modal content
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column'
  }}>
    {/* Header, Body, Footer */}
  </div>
</div>
```

### Important Modal Rules
1. **Fixed height** - Use `minHeight: 350px` for tab content
2. **No size jumping** - Modal must not resize when switching tabs
3. **Scrollable content** - Body scrolls, header/footer stay fixed
4. **Clean form styling** - See Form Design section

---

## 📝 Form Design Pattern

### Modern Input Fields
**NEVER use shadcn/ui form components directly**. Use styled HTML elements:

```jsx
// Input field pattern
<div>
  <label style={{
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.375rem'
  }}>
    Field Label
  </label>
  <input
    type="text"
    style={{
      width: '100%',
      padding: '0.625rem 0.875rem',
      fontSize: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: 'white',
      color: '#111827',
      outline: 'none',
      transition: 'all 0.2s'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#3b82f6'
      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#d1d5db'
      e.target.style.boxShadow = 'none'
    }}
  />
</div>
```

### Form Layout
- Use **grid layouts** for paired fields (e.g., City/State)
- **Consistent spacing**: `gap: '1.25rem'` between fields
- **Clear sections**: Use tabs for organizing complex forms

---

## ⚠️ Critical Lessons Learned

### DO's ✅
1. **Use inline styles** for critical layout components to ensure consistency
2. **Test in browser** before declaring ready
3. **Maintain full-screen design** - No black borders or margins
4. **Keep sidebar fixed** at 260px width
5. **Use FormProvider** from react-hook-form, not custom Form components
6. **Follow the color palette** religiously

### DON'Ts ❌
1. **Don't use dark themes** for main content areas
2. **Don't mix Tailwind classes** with critical inline styles
3. **Don't use shadcn/ui components** without restyling
4. **Don't let modals resize** when content changes
5. **Don't stack sidebar above content** - Always side-by-side
6. **Don't use empty string values** in Select components

---

## 🔄 Migration Checklist for New Modules

When creating a new module (e.g., Equipment, IPAM, Contacts):

### 1. Page Setup
- [ ] Wrap page in `AppLayout`
- [ ] Use consistent padding: `1.5rem`
- [ ] Set background: `#f8fafc`
- [ ] Add page header with title

### 2. Table Implementation
- [ ] White background with border
- [ ] Clickable rows for navigation
- [ ] Action buttons in header
- [ ] Status badges with correct colors
- [ ] Search bar if needed

### 3. Detail Page
- [ ] Breadcrumb navigation back to list
- [ ] Header with title and status
- [ ] Statistics cards if applicable
- [ ] Tabs for different sections
- [ ] Edit/Delete buttons

### 4. Forms/Modals
- [ ] Fixed modal size
- [ ] Modern input styling with focus states
- [ ] Proper form validation
- [ ] Loading states for submissions
- [ ] Clear success/error messages

### 5. Testing
- [ ] Check in browser (not just code)
- [ ] Verify full-screen display
- [ ] Test all interactions
- [ ] Ensure consistent styling
- [ ] Verify no console errors

---

## 🎨 Status Badge Colors

Use these consistently across all modules:

```javascript
const statusColors = {
  active: '#10b981',      // Green
  inactive: '#6b7280',    // Gray
  pending: '#f59e0b',     // Amber
  error: '#ef4444',       // Red
  warning: '#f97316',     // Orange
  info: '#0ea5e9',        // Sky blue
  success: '#10b981'      // Green
}
```

---

## 📁 File Structure Best Practices

```
frontend/src/
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx        # Master layout (DO NOT duplicate)
│   └── modules/
│       ├── sites/
│       │   ├── SitesTable.tsx
│       │   └── SiteFormModal.tsx
│       ├── equipment/           # Follow same pattern
│       └── ipam/                # Follow same pattern
├── app/
│   ├── sites/
│   │   ├── page.tsx            # List page
│   │   └── [id]/
│   │       └── page.tsx        # Detail page
│   └── [other-modules]/        # Same structure
└── styles/
    └── globals.css             # Global styles only
```

---

## 🚀 Quick Start for New Module

```jsx
// 1. Create list page: app/module-name/page.tsx
'use client'
import AppLayout from '@/components/layout/AppLayout'
import ModuleTable from '@/components/modules/module-name/ModuleTable'

export default function ModulePage() {
  return (
    <AppLayout>
      <ModuleTable />
    </AppLayout>
  )
}

// 2. Create table component with proper styling
// 3. Create detail page: app/module-name/[id]/page.tsx
// 4. Create form modal with modern inputs
// 5. Test everything in browser
```

---

## 📋 Final Notes

1. **Consistency is key** - Every module should look like it belongs to the same system
2. **Professional appearance** - This is enterprise software, maintain high standards
3. **User experience** - Fast, responsive, and predictable interactions
4. **No surprises** - Follow the patterns established in Sites module
5. **When in doubt** - Reference the Sites module implementation

Remember: The goal is a unified, professional system that looks like it was designed by a single team with a clear vision. Every new module should complement what already exists, not introduce new patterns or styles.

---

*This document should be updated as new patterns emerge or existing ones are refined.*