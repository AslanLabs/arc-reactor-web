import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import './UserMenu.css'

export function UserMenu() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  if (!user) return null

  const initials = user.name
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="UserMenu" ref={menuRef}>
      <button
        className="UserMenu-trigger"
        onClick={() => setOpen(prev => !prev)}
        aria-label={t('user.menu')}
        aria-expanded={open}
      >
        <span className="UserMenu-avatar">{initials}</span>
      </button>

      {open && (
        <div className="UserMenu-dropdown">
          <div className="UserMenu-profile">
            <span className="UserMenu-avatar UserMenu-avatar--large">{initials}</span>
            <div className="UserMenu-info">
              <div className="UserMenu-name">{user.name}</div>
              <div className="UserMenu-email">{user.email}</div>
              <div className="UserMenu-role">{user.role}</div>
            </div>
          </div>
          <div className="UserMenu-divider" />
          <button className="UserMenu-item UserMenu-item--danger" onClick={() => { logout(); setOpen(false) }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t('user.logout')}
          </button>
        </div>
      )}
    </div>
  )
}
