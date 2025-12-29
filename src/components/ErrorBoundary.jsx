import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="retro-card scanlines p-6 text-retro-red border-2 border-red-500">
          <h2 className="retro-font retro-glow mb-2">Something went wrong.</h2>
          <p className="text-sm">Please continue; your progress is saved.</p>
        </div>
      );
    }
    return this.props.children;
  }
}


