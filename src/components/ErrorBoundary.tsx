"use client";

import React from "react";
import { APP_NAME, APP_VERSION } from "@/lib/version";
import { logError } from "@/lib/logger";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logError("Uncaught UI error", {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  private buildDiagnostics(): string {
    const { error } = this.state;
    return [
      `${APP_NAME} v${APP_VERSION}`,
      `Error: ${error?.message ?? "Unknown"}`,
      `Stack: ${error?.stack ?? "N/A"}`,
      `User-Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}`,
      `URL: ${typeof window !== "undefined" ? window.location.href : "N/A"}`,
      `Time: ${new Date().toISOString()}`,
    ].join("\n");
  }

  private handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(this.buildDiagnostics());
    } catch {
      /* clipboard may fail in insecure contexts */
    }
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              Something went wrong
            </p>
            <p className="text-sm text-gray-400">
              An unexpected error occurred. You can try reloading or copy
              diagnostic information to include in a bug report.
            </p>
            {this.state.error && (
              <p className="text-xs text-red-300 font-mono break-all bg-gray-800 rounded p-3">
                {this.state.error.message}
              </p>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleCopy}
                className="px-4 py-2 text-sm rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Copy Diagnostics
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
