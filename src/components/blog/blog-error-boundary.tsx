'use client'

import { Component } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BlogErrorBoundaryProps {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class BlogErrorBoundary extends Component<BlogErrorBoundaryProps, State> {
  constructor(props: BlogErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            An error occurred while loading the blog content.
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Button asChild variant="default">
              <Link href="/blog">Go to Blog</Link>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}