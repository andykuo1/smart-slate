import React from 'react';

export default class ErrorBoundary extends React.Component {
  /**
   * @param {object} props
   */
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { error: '', hasError: false };
  }

  /**
   * @param {Error} error
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { error: error.toString() + ' | ' + error.name + ' => ' + error.message + ' => ' + error.stack, hasError: true };
  }

  /**
   * @override
   * @param {Error} error
   * @param {import('react').ErrorInfo} errorInfo
   */
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.error({ error, errorInfo });
  }

  /** @override */
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-white text-black text-center flex flex-col items-center overflow-y-auto">
          <div className="flex-1"/>
          <h2>Oops, there is an error!</h2>
          <p>
            {this.state.error}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}>
            Try again?
          </button>
          <div className="flex-1"/>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}
