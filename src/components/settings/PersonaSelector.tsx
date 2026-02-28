import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { PersonaResponse } from '../../types/api'
import { listPersonas } from '../../services/personas'
import './PersonaSelector.css'

interface PersonaSelectorProps {
  value: string | null
  onChange: (personaId: string | null) => void
  onSystemPromptPreview?: (prompt: string) => void
}

export function PersonaSelector({ value, onChange, onSystemPromptPreview }: PersonaSelectorProps) {
  const { t } = useTranslation()
  const [personas, setPersonas] = useState<PersonaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPersonas = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listPersonas()
      setPersonas(data)
    } catch {
      setError(t('persona.loadError'))
      setPersonas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPersonas()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent of selected persona's system prompt
  useEffect(() => {
    if (!value || !onSystemPromptPreview) return
    const selected = personas.find(p => p.id === value)
    if (selected) onSystemPromptPreview(selected.systemPrompt)
  }, [value, personas, onSystemPromptPreview])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value || null
    onChange(id)
  }

  if (loading) {
    return <div className="PersonaSelector-loading">{t('persona.loading')}</div>
  }

  if (error && personas.length === 0) {
    return (
      <div className="PersonaSelector-error">
        <span>{error}</span>
        <button className="PersonaSelector-retryBtn" onClick={fetchPersonas}>{t('persona.retry')}</button>
      </div>
    )
  }

  return (
    <div className="PersonaSelector">
      <select
        className="PersonaSelector-select"
        value={value ?? ''}
        onChange={handleSelect}
      >
        <option value="">{t('persona.custom')}</option>
        {personas.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}{p.isDefault ? ` (${t('persona.default')})` : ''}
          </option>
        ))}
      </select>

      {value && (() => {
        const selected = personas.find(p => p.id === value)
        if (!selected) return null
        return (
          <div className="PersonaSelector-preview">
            <div className="PersonaSelector-previewPrompt">{selected.systemPrompt}</div>
          </div>
        )
      })()}

      {error && <div className="PersonaSelector-inlineError">{error}</div>}
    </div>
  )
}
