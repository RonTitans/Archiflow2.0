'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Direction = 'ltr' | 'rtl'

interface DirectionContextType {
  direction: Direction
  toggleDirection: () => void
  setDirection: (dir: Direction) => void
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined)

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirectionState] = useState<Direction>('ltr')

  useEffect(() => {
    const savedDirection = localStorage.getItem('direction') as Direction
    const initialDirection = savedDirection || 'ltr'
    setDirectionState(initialDirection)
    document.documentElement.dir = initialDirection
    document.documentElement.setAttribute('dir', initialDirection)
  }, [])

  const setDirection = (dir: Direction) => {
    setDirectionState(dir)
    document.documentElement.dir = dir
    document.documentElement.setAttribute('dir', dir)
    localStorage.setItem('direction', dir)
  }

  const toggleDirection = () => {
    const newDirection = direction === 'ltr' ? 'rtl' : 'ltr'
    setDirection(newDirection)
  }

  return (
    <DirectionContext.Provider value={{ direction, toggleDirection, setDirection }}>
      {children}
    </DirectionContext.Provider>
  )
}

export const useDirection = () => {
  const context = useContext(DirectionContext)
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }
  return context
}