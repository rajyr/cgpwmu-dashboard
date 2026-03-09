import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import './index.css'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', fontFamily: 'monospace', minHeight: '100vh' }}>
                    <h2>Application Crashed</h2>
                    <p>{this.state.error?.toString()}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <LanguageProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </LanguageProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
