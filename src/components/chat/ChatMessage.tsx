import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChatMessage as ChatMessageType } from '../../types/chat'
import { MarkdownRenderer } from '../common/MarkdownRenderer'
import { MessageActions } from './MessageActions'
import { formatDuration } from '../../utils/formatters'
import './ChatMessage.css'

interface ChatMessageProps {
  message: ChatMessageType
  isLast: boolean
  isLoading: boolean
  showMetadata: boolean
  onRetry?: () => void
  onRegenerate?: () => void
  onDelete?: () => void
  onEdit?: (content: string) => void
}

export function ChatMessage({
  message, isLast, isLoading, showMetadata, onRetry, onRegenerate, onDelete, onEdit,
}: ChatMessageProps) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const editRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus()
      editRef.current.style.height = 'auto'
      editRef.current.style.height = editRef.current.scrollHeight + 'px'
    }
  }, [editing])

  const handleEditSubmit = () => {
    if (editContent.trim() && editContent.trim() !== message.content) {
      onEdit?.(editContent.trim())
    }
    setEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditSubmit()
    }
    if (e.key === 'Escape') {
      setEditContent(message.content)
      setEditing(false)
    }
  }

  const showPlaceholder = isLoading && isLast && message.role === 'assistant' && !message.content

  return (
    <div className={`ChatMessage ChatMessage--${message.role} ${message.error ? 'ChatMessage--error' : ''}`}>
      <div className="ChatMessage-bubble">
        {message.role === 'assistant' && message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="ChatMessage-tools">
            {message.toolsUsed.map(t => (
              <span key={t} className="ChatMessage-toolBadge">{t}</span>
            ))}
          </div>
        )}
        <div className="ChatMessage-content">
          {editing ? (
            <div className="ChatMessage-editForm">
              <textarea
                ref={editRef}
                className="ChatMessage-editInput"
                value={editContent}
                onChange={e => {
                  setEditContent(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                onKeyDown={handleEditKeyDown}
              />
              <div className="ChatMessage-editActions">
                <button className="ChatMessage-editSave" onClick={handleEditSubmit}>
                  {t('actions.save')}
                </button>
                <button className="ChatMessage-editCancel" onClick={() => { setEditContent(message.content); setEditing(false) }}>
                  {t('actions.cancel')}
                </button>
              </div>
            </div>
          ) : message.error ? (
            <span className="ChatMessage-errorText">{message.content}</span>
          ) : showPlaceholder ? (
            <span className="ChatMessage-typingIndicator">
              <span className="ChatMessage-dot" />
              <span className="ChatMessage-dot" />
              <span className="ChatMessage-dot" />
            </span>
          ) : message.role === 'assistant' && message.content ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <p className="ChatMessage-text">{message.content}</p>
          )}
        </div>
        {message.role === 'user' && message.attachments && message.attachments.length > 0 && (
          <div className="ChatMessage-attachments">
            {message.attachments.map((att, i) => (
              att.previewUrl ? (
                <img key={i} src={att.previewUrl} alt={att.name} className="ChatMessage-attachmentImg" />
              ) : (
                <span key={i} className="ChatMessage-attachmentFile">{att.name}</span>
              )
            ))}
          </div>
        )}
        {showMetadata && message.role === 'assistant' && message.durationMs && (
          <div className="ChatMessage-meta">
            {formatDuration(message.durationMs)}
          </div>
        )}
        {message.content && !showPlaceholder && !editing && (
          <MessageActions
            content={message.content}
            role={message.role}
            onRetry={onRetry}
            onRegenerate={onRegenerate}
            onDelete={onDelete}
            onEdit={onEdit ? () => { setEditContent(message.content); setEditing(true) } : undefined}
          />
        )}
      </div>
    </div>
  )
}
