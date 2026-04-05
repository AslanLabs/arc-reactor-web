import { useTranslation } from 'react-i18next'
import './EmptyState.css'

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void
}

const SUGGESTION_ICONS = [
  // lightbulb
  <svg key="0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></svg>,
  // code
  <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  // search
  <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  // chat
  <svg key="3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
]

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  const { t } = useTranslation()

  const suggestions = [
    t('suggestions.explain'),
    t('suggestions.code'),
    t('suggestions.search'),
    t('suggestions.hello'),
  ]

  return (
    <div className="EmptyState">
      <div className="EmptyState-logo">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      <h2 className="EmptyState-title">{t('chat.emptyState')}</h2>
      <div className="EmptyState-suggestions">
        {suggestions.map((s, i) => (
          <button
            key={s}
            className="EmptyState-suggestion"
            onClick={() => onSuggestionClick(s)}
          >
            <span className="EmptyState-suggestionIcon">{SUGGESTION_ICONS[i]}</span>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
