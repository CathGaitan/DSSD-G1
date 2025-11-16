import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 importamos esto
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { api } from '../api/api';
import { CheckboxField } from '../components/ui/CheckboxField';

interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
    onRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [useCloudLogin, setUseCloudLogin] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const data = await api.login(username, password, useCloudLogin);

        if (!data.access_token) {
            return setError("No se recibió token del servidor");
        }

        // Guardamos token local siempre
        localStorage.setItem("local_token", data.access_token);
        localStorage.setItem("username", username);
        
        // Si vino token Cloud, también lo guardamos
        if (data.cloud_access_token) {
            localStorage.setItem("cloud_token", data.cloud_access_token);
        }

        onLoginSuccess(data.local_access_token ?? data.access_token);
        navigate("/");

    } catch (err: any) {
        setError(err.message || "Error al iniciar sesión");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Usuario"
                    name="Usuario"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    disabled={loading}
                />
                <InputField
                    label="Contraseña"
                    name="Contraseña"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <div className="mt-2">
                    <CheckboxField
                        label="Loguearse también en Cloud"
                        checked={useCloudLogin}
                        onChange={(e) => setUseCloudLogin(e.target.checked)}
                        disabled={loading}
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="mt-6 flex flex-col items-center">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-lg transition-colors"
                    >
                        {loading ? 'Iniciando sesión...' : 'Ingresar'}
                    </Button>
                    <p className="mt-4 text-gray-600 text-sm">
                        ¿No tienes cuenta?{' '}
                        <button
                            type="button"
                            onClick={onRegister}
                            className="text-blue-600 hover:underline font-medium"
                            disabled={loading}
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
