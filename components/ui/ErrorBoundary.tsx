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
          background: "#080808",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          fontFamily: "'EB Garamond', serif",
          color: "#e8e0d0",
        }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: "24px", letterSpacing: "0.2em", color: "#d4af37" }}>
            CHRONICLE
          </p>
          <p style={{ fontSize: "16px", fontStyle: "italic", color: "rgba(232,224,208,0.5)" }}>
            Something went wrong.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "transparent",
              border: "1px solid rgba(212,175,55,0.45)",
              borderRadius: "2px",
              padding: "10px 24px",
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "#d4af37",
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
