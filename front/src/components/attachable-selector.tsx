import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Attachable, Workflow, Resource } from "@/types/attachable"

type AttachableSelectorProps<T extends Attachable["type"]> = {
  type: T
  items: T extends "resource" ? Resource[] : Workflow[]
  selectAttachable: (type: Attachable["type"], id: string) => void,
  hasAvailableAttachables: boolean
}

export default function AttachableSelector<T extends Attachable["type"]>({
  type,
  items,
  selectAttachable,
  hasAvailableAttachables,
}: AttachableSelectorProps<T>) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 py-0 px-2">
        <Command>
          <CommandInput placeholder={`Search ${type}`} className="h-9" />
          <CommandList>
            {!hasAvailableAttachables ? (
              <CommandEmpty className="text-center text-sm py-2">
                {`All ${type} have been added.`}
              </CommandEmpty>)
              : (<CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={(currentValue) => {
                      setOpen(false)
                      selectAttachable(type, currentValue)
                    }}
                  >
                    {item.id}
                  </CommandItem>
                ))}
              </CommandGroup>)
            }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
