import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ErrorBoundary">
          <div className="ErrorBoundary-card">
            <h1 className="ErrorBoundary-title">Something went wrong</h1>
            <p className="ErrorBoundary-description">
              An unexpected error occurred. Try refreshing the page or click the button below to recover.
            </p>
            {this.state.error && (
              <pre className="ErrorBoundary-trace">
                {this.state.error.message}
              </pre>
            )}
            <div className="ErrorBoundary-actions">
              <button className="ErrorBoundary-retryBtn" onClick={this.handleReset}>
                Try again
              </button>
              <button className="ErrorBoundary-reloadBtn" onClick={() => window.location.reload()}>
                Reload page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
