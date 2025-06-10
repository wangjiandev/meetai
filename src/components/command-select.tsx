import { ReactNode, useState } from 'react'
import { ChevronsUpDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from '@/components/ui/command'
import { Button } from '@/components/ui/button'

interface CommandSelectProps {
  options: Array<{
    id: string
    value: string
    children: ReactNode
  }>
  onSelect: (value: string) => void
  onSearch?: (value: string) => void
  value: string
  placeholder?: string
  isSearchable?: boolean
  className?: string
}

const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = 'Select an option',
  isSearchable,
  className,
}: CommandSelectProps) => {
  const [open, setOpen] = useState(false)
  const selectedOption = options.find((option) => option.value === value)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onSearch?.('')
    }
    setOpen(open)
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn('h-9 justify-between px-2 font-normal', !selectedOption && 'text-muted-foreground', className)}>
        <div className="flex w-full items-center justify-between gap-x-2">
          <div>{selectedOption?.children ?? placeholder}</div>
          <ChevronsUpDownIcon className="size-4" />
        </div>
      </Button>
      <CommandResponsiveDialog open={open} onOpenChange={handleOpenChange} shouldFilter={!onSearch}>
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground">No options found</span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              value={option.value}
              onSelect={() => {
                onSelect(option.value)
                setOpen(false)
              }}>
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  )
}

export default CommandSelect
