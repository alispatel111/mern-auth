"use client"

import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Reload the page if needed
    if (this.props.reloadOnRetry) {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">
              <AlertCircle size={48} />
            </div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              {this.state.error ? this.state.error.message : "An unexpected error occurred"}
            </p>
            <button className="error-boundary-button" onClick={this.handleRetry}>
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
            {this.props.showHomeLink && (
              <a href="/" className="error-boundary-home-link">
                Return to Home
              </a>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
