import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props {
  language?: string
  children: string
}

export default function CodeBlockHighlighter({ language, children }: Props) {
  return (
    <SyntaxHighlighter
      style={oneDark}
      language={language || 'text'}
      PreTag="div"
      showLineNumbers
      customStyle={{
        margin: 0,
        borderRadius: '0 0 8px 8px',
        fontSize: '0.85rem',
      }}
    >
      {children}
    </SyntaxHighlighter>
  )
}
