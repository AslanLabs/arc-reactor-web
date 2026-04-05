import { useTranslation } from 'react-i18next'
import { AVAILABLE_MODELS } from '../../utils/constants'
import './ModelSelector.css'

interface ModelSelectorProps {
  value: string | null
  onChange: (model: string | null) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const { t } = useTranslation()

  return (
    <select
      className="ModelSelector"
      value={value ?? ''}
      onChange={e => onChange(e.target.value || null)}
      aria-label={t('settings.model')}
    >
      {AVAILABLE_MODELS.map(m => (
        <option key={m.id} value={m.id}>
          {m.label}{m.provider ? ` (${m.provider})` : ''}
        </option>
      ))}
    </select>
  )
}
