import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Provider = "netease" | "tencent" | "kugou" | "baidu" | "kuwo"

interface ProviderSelectorProps {
  value: Provider
  onValueChange: (value: Provider) => void
  className?: string
}

export function ProviderSelector({ value, onValueChange, className }: ProviderSelectorProps) {
  return (
    <div className={className}>
      <Select value={value} onValueChange={(v) => onValueChange(v as Provider)}>
        <SelectTrigger>
          <SelectValue placeholder="平台" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="netease">网易云</SelectItem>
          <SelectItem value="tencent">QQ音乐</SelectItem>
          <SelectItem value="kugou">酷狗</SelectItem>
          <SelectItem value="kuwo">酷我</SelectItem>
          <SelectItem value="baidu">百度</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
