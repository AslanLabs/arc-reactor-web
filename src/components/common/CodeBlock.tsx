import { useState, lazy, Suspense } from 'react'
import './CodeBlock.css'

const LazyHighlighter = lazy(() =>
  import('./CodeBlockHighlighter')
)

interface CodeBlockProps {
  language?: string
  children: string
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = children
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

  return (
    <div className="CodeBlock">
      <div className="CodeBlock-header">
        <span className="CodeBlock-lang">{language || 'code'}</span>
        <button className="CodeBlock-copyBtn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <Suspense fallback={<pre className="CodeBlock-fallback">{children}</pre>}>
        <LazyHighlighter language={language}>{children}</LazyHighlighter>
      </Suspense>
    </div>
  )
}
