import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProviderSelector, type Provider } from "@/components/provider-selector"

interface PageHeaderProps {
  title: string
  provider: Provider
  setProvider: (provider: Provider) => void
  inputValue: string
  setInputValue: (value: string) => void
  placeholder: string
  actionLabel: string
  onAction: () => void
  loading?: boolean
}

export function PageHeader({
  title,
  provider,
  setProvider,
  inputValue,
  setInputValue,
  placeholder,
  actionLabel,
  onAction,
  loading = false,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <ProviderSelector 
          value={provider} 
          onValueChange={setProvider} 
          className="w-full md:w-32"
        />
        
        <div className="flex-1 flex gap-2">
          <Input 
            placeholder={placeholder}
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAction()}
          />
          <Button onClick={onAction} disabled={loading}>
            {loading ? `${actionLabel}中...` : actionLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
