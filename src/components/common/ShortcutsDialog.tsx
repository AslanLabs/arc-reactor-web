import { useTranslation } from 'react-i18next'
import './ShortcutsDialog.css'

interface ShortcutsDialogProps {
  open: boolean
  onClose: () => void
}

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent)
const mod = isMac ? 'Cmd' : 'Ctrl'

const SHORTCUTS = [
  { keys: `${mod} + N`, action: 'shortcuts.newChat' },
  { keys: `${mod} + L`, action: 'shortcuts.clearChat' },
  { keys: `${mod} + ,`, action: 'shortcuts.settings' },
  { keys: `${mod} + ?`, action: 'shortcuts.help' },
  { keys: 'Enter', action: 'shortcuts.send' },
  { keys: 'Shift + Enter', action: 'shortcuts.newLine' },
  { keys: 'Esc', action: 'shortcuts.cancel' },
] as const

export function ShortcutsDialog({ open, onClose }: ShortcutsDialogProps) {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div className="ShortcutsDialog-backdrop" onClick={onClose}>
      <div className="ShortcutsDialog" onClick={e => e.stopPropagation()}>
        <div className="ShortcutsDialog-header">
          <h2>{t('shortcuts.title')}</h2>
          <button className="ShortcutsDialog-close" onClick={onClose}>&times;</button>
        </div>
        <div className="ShortcutsDialog-list">
          {SHORTCUTS.map(s => (
            <div key={s.keys} className="ShortcutsDialog-row">
              <kbd className="ShortcutsDialog-keys">{s.keys}</kbd>
              <span className="ShortcutsDialog-action">{t(s.action)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
