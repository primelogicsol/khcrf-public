"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in React Tree:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-red-50 rounded-lg border border-red-200 shadow-sm m-4">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong.</h2>
          <p className="text-red-600 max-w-lg mb-6">
            The application encountered an unexpected error while rendering this component.
            Please try refreshing the page or contacting support if the problem persists.
          </p>
          {this.state.error && (
            <pre className="bg-red-100 p-4 rounded text-sm text-left text-red-800 overflow-auto w-full max-w-2xl border border-red-300">
              {this.state.error.toString()}
            </pre>
          )}
          <button 
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
