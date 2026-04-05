import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './MessageActions.css'

interface MessageActionsProps {
  content: string
  role: 'user' | 'assistant'
  onRetry?: () => void
  onRegenerate?: () => void
  onDelete?: () => void
  onEdit?: () => void
}

export function MessageActions({ content, role, onRetry, onRegenerate, onDelete, onEdit }: MessageActionsProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleFeedback = (type: 'up' | 'down') => {
    const newFeedback = feedback === type ? null : type
    setFeedback(newFeedback)
    if (newFeedback) {
      // Fire-and-forget feedback submission
      fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('arc-reactor-auth-token')
            ? { 'Authorization': `Bearer ${localStorage.getItem('arc-reactor-auth-token')}` }
            : {}),
        },
        body: JSON.stringify({
          rating: newFeedback === 'up' ? 'THUMBS_UP' : 'THUMBS_DOWN',
          response: content,
        }),
      }).catch(() => { /* ignore */ })
    }
  }

  return (
    <div className="MessageActions">
      <button
        className={`MessageActions-btn ${copied ? 'MessageActions-btn--copied' : ''}`}
        onClick={handleCopy}
        title={t('actions.copy')}
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z" />
            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z" />
          </svg>
        )}
      </button>
      {role === 'user' && onEdit && (
        <button className="MessageActions-btn" onClick={onEdit} title={t('actions.edit')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L3.462 11.1a.25.25 0 00-.064.108l-.631 2.208 2.208-.63a.25.25 0 00.108-.064l8.61-8.61a.25.25 0 000-.354l-1.086-1.086z" />
          </svg>
        </button>
      )}
      {role === 'assistant' && onRegenerate && (
        <button className="MessageActions-btn" onClick={onRegenerate} title={t('actions.regenerate')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3a5 5 0 104.546 2.914.75.75 0 011.36-.636A6.5 6.5 0 118 1.5v-1a.5.5 0 01.854-.354l2 2a.5.5 0 010 .708l-2 2A.5.5 0 018 4.5V3z" />
          </svg>
        </button>
      )}
      {role === 'assistant' && (
        <>
          <button
            className={`MessageActions-btn ${feedback === 'up' ? 'MessageActions-btn--active' : ''}`}
            onClick={() => handleFeedback('up')}
            title={t('actions.thumbsUp')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.834.066C7.494-.087 6.5 1.048 6.5 2.25v.5c0 1.329-.647 2.55-1.737 3.3L4 6.56v6.5l.16.12A6.5 6.5 0 007.5 14h4a1.5 1.5 0 001.451-1.114l1.4-5.363A1.5 1.5 0 0012.9 5.75H9.5V2.25a1.252 1.252 0 00-.666-1.184z" />
              <path d="M2.5 14V7h-1a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h1z" />
            </svg>
          </button>
          <button
            className={`MessageActions-btn ${feedback === 'down' ? 'MessageActions-btn--active' : ''}`}
            onClick={() => handleFeedback('down')}
            title={t('actions.thumbsDown')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ transform: 'rotate(180deg)' }}>
              <path d="M8.834.066C7.494-.087 6.5 1.048 6.5 2.25v.5c0 1.329-.647 2.55-1.737 3.3L4 6.56v6.5l.16.12A6.5 6.5 0 007.5 14h4a1.5 1.5 0 001.451-1.114l1.4-5.363A1.5 1.5 0 0012.9 5.75H9.5V2.25a1.252 1.252 0 00-.666-1.184z" />
              <path d="M2.5 14V7h-1a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h1z" />
            </svg>
          </button>
        </>
      )}
      {onRetry && (
        <button className="MessageActions-btn" onClick={onRetry} title={t('actions.retry')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.22 14.78a.75.75 0 001.06-1.06L4.56 12h8.69A2.75 2.75 0 0016 9.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.56l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3a.75.75 0 000 1.06l3 3z" />
            <path d="M10.78 1.22a.75.75 0 00-1.06 1.06L11.44 4H2.75A2.75 2.75 0 000 6.75v2.5a.75.75 0 001.5 0v-2.5c0-.69.56-1.25 1.25-1.25h8.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button className="MessageActions-btn MessageActions-btn--delete" onClick={onDelete} title={t('actions.delete')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
            <path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
          </svg>
        </button>
      )}
    </div>
  )
}
