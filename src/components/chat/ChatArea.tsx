import { useRef, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useChatContext } from '../../context/ChatContext'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ToolIndicator } from './ToolIndicator'
import { ApprovalBanner } from './ApprovalBanner'
import { EmptyState } from './EmptyState'
import { ActiveConfigIndicator } from './ActiveConfigIndicator'
import { ModelSelector } from './ModelSelector'
import './ChatArea.css'

interface ChatAreaProps {
  onOpenSettings?: () => void
}

export function ChatArea({ onOpenSettings }: ChatAreaProps) {
  const { t } = useTranslation()
  const {
    messages, isLoading, activeTool,
    sendMessage, stopGeneration, retryLastMessage,
    regenerateMessage, deleteMessage, editMessage,
    settings, updateSettings,
  } = useChatContext()
  const messagesRef = useRef<HTMLElement>(null)
  const [suggestion, setSuggestion] = useState<string | undefined>()
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleScroll = () => {
    const el = messagesRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distFromBottom > 200)
  }

  const handleSuggestion = (text: string) => {
    setSuggestion(text)
    setTimeout(() => setSuggestion(undefined), 100)
  }

  return (
    <div className="ChatArea">
      {onOpenSettings && <ActiveConfigIndicator onOpenSettings={onOpenSettings} />}
      <div className="ChatArea-topBar">
        <ModelSelector
          value={settings.model}
          onChange={(model) => updateSettings({ model })}
        />
      </div>
      <main
        className="ChatArea-messages"
        ref={messagesRef}
        aria-live="polite"
        onScroll={handleScroll}
      >
        {messages.length === 0 && (
          <EmptyState onSuggestionClick={handleSuggestion} />
        )}
        {messages.map((msg, i) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isLast={i === messages.length - 1}
            isLoading={isLoading}
            showMetadata={settings.showMetadata}
            onRetry={msg.role === 'assistant' && i === messages.length - 1 ? retryLastMessage : undefined}
            onRegenerate={msg.role === 'assistant' ? () => regenerateMessage(msg.id) : undefined}
            onDelete={() => deleteMessage(msg.id)}
            onEdit={msg.role === 'user' ? (content: string) => editMessage(msg.id, content) : undefined}
          />
        ))}
        {activeTool && <ToolIndicator toolName={activeTool} />}
        <ApprovalBanner />
      </main>
      {showScrollBtn && (
        <button className="ChatArea-scrollBtn" onClick={scrollToBottom} aria-label={t('chat.scrollToBottom')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 11.5a.5.5 0 00.354-.146l4-4a.5.5 0 00-.708-.708L8 10.293 4.354 6.646a.5.5 0 10-.708.708l4 4A.5.5 0 008 11.5z" />
          </svg>
        </button>
      )}
      <ChatInput
        onSend={(text, files) => sendMessage(text, files)}
        onStop={stopGeneration}
        disabled={isLoading}
        initialValue={suggestion}
      />
    </div>
  )
}
