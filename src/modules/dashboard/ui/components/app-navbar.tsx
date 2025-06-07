'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'

import AppCommand from './app-command'

const AppNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <AppCommand open={open} setOpen={setOpen} />
      <nav className="bg-background border-input flex items-center gap-2 border-b px-4 py-3">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        <Button
          variant="outline"
          className="text-muted-foreground hover:text-muted-foreground h-9 w-[240px] justify-start font-normal"
          onClick={() => setOpen(true)}>
          <SearchIcon className="size-4" />
          Search
          <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>
            <span className="text-xs">K</span>
          </kbd>
        </Button>
      </nav>
    </>
  )
}

export default AppNavbar
