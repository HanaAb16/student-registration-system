import { useState } from 'react';
import { login } from '../services/api';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = await login({ email, password });
            onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
            <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div className="brand-icon" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px', borderRadius: '12px' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>System Sign In</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '6px' }}>
                        Authenticate with your account credentials
                    </p>
                </div>

                {error && (
                    <div className="alert-error" role="alert" style={{ marginBottom: '20px', padding: '12px 14px', fontSize: '0.875rem' }}>
                        <svg className="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <div>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '18px' }}>
                        <label className="form-label" htmlFor="email">
                            Email Address <span className="form-label-required">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label" htmlFor="password">
                            Password <span className="form-label-required">*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9375rem', fontWeight: 600 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
