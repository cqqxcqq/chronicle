"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "var(--color-void)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          fontFamily: "var(--font-body)",
          color: "var(--color-bone)",
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "24px", letterSpacing: "0.2em", color: "var(--color-gold)" }}>
            CHRONICLE
          </p>
          <p style={{ fontSize: "16px", fontStyle: "italic", color: "var(--color-bone-dim)" }}>
            Something went wrong.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "transparent",
              border: "var(--border-standard)",
              borderRadius: "var(--border-radius)",
              padding: "10px 24px",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "var(--color-gold)",
              marginTop: "8px",
            }}
          >
            RELOAD
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
