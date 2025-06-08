import { useState } from "react"
import { Attachable } from "@/types/attachable"

export const useAttachables = (attachables: Attachable[]) => {
    const [
        availableAttachables,
        setAvailableAttachables
    ] = useState<Attachable[]>(attachables)

    const [
        selectedAttachables,
        setSelectedAttachables
    ] = useState<Attachable[]>([])

    const selectAttachable = (type: Attachable["type"], id: string) => {
        setSelectedAttachables([
            ...selectedAttachables,
            availableAttachables.find(a => a.type === type && a.id === id)!
        ])
        setAvailableAttachables(availableAttachables.filter(
            a => a.type !== type || a.id !== id
        ))
    }

    const unselectAttachable = (type: Attachable["type"], id: string) => {
        setAvailableAttachables([
            ...availableAttachables,
            selectedAttachables.find(a => a.type === type && a.id === id)!
        ])
        setSelectedAttachables(selectedAttachables.filter(a => a.type !== type || a.id !== id))
    }

    return {
        availableAttachables,
        selectedAttachables,
        selectAttachable,
        unselectAttachable
    }
}

