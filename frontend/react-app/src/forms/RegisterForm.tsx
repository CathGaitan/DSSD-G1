import React, { useState } from 'react';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';

interface RegisterFormProps {}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
    const [form, setForm] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const validatePassword = (password: string): string | null => {
        if (!/[A-Z]/.test(password)) return "Debe tener al menos una letra mayúscula.";
        if (!/[a-z]/.test(password)) return "Debe tener al menos una letra minúscula.";
        if (!/\d/.test(password)) return "Debe tener al menos un número.";
        if (!/[^A-Za-z0-9]/.test(password)) return "Debe tener al menos un carácter especial.";
        if (password.length < 6) return "Debe tener al menos 6 caracteres.";
        return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const passwordError = validatePassword(form.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password
                })
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.detail || "Error desconocido");
                return;
            }

            setSuccess("Usuario registrado correctamente 🎉");
            setForm({ username: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span>📋</span> Registro
                </h2>
                <p className="text-sm text-blue-700 mb-4">Complete sus datos para registrarse</p>

                <InputField
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                />
                <div style={{ height: 16 }} />

                <InputField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />
                <div style={{ height: 16 }} />

                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                />
                <div style={{ height: 16 }} />

                <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                />

                 {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}

                <Button type="submit" className="w-full mt-4">
                    Registrarse
                </Button>
            </div>
        </form>
    );
};

export default RegisterForm;
