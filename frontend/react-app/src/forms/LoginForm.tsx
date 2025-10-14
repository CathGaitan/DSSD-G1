import React, { useState } from 'react';

interface LoginFormProps {
    onSubmit: (credentials: { email: string; password: string }) => void;
    loading?: boolean;
    error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
            <h2>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            <div style={{ marginBottom: 12 }}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default LoginForm;