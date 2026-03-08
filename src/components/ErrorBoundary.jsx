import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
                        <p className="text-gray-600 mb-6">
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#114516] text-white px-6 py-2 rounded-lg hover:bg-green-800"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
