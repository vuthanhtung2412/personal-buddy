import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Attachable } from "@/types/attachable"

type AttachbleProps = (Pick<Attachable, "type" | "id">) & {
  onRemove: () => void
}
export function AttachableBadge(
  {
    type,
    id,
    onRemove,
  }: AttachbleProps,
) {
  return (
    <Badge variant={type === "resource" ? "secondary" : "outline"}>
      {id}
      <button
        onClick={onRemove}
      >
        <X size={12} />
      </button>
    </Badge>
  )
}
