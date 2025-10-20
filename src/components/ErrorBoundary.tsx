import React from "react";

type State = { hasError: boolean };
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // можно отправить в Sentry/LogRocket и т.п.
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: "#fff" }}>
          <h2>Something went wrong.</h2>
          <p>Try reloading the section.</p>
        </div>
      );
    }
    return this.props.children;
  }
}