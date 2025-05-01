'use client';

import { useState } from 'react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao registrar.');
      }

      setSuccess(
        'Registro iniciado! Verifique seu e-mail para confirmar sua conta.'
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Erro ao registrar.');
      } else {
        setError('Erro desconhecido.');
      }
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Registrar</h1>
      <form onSubmit={handleRegister} className='space-y-4'>
        <div>
          <label className='block font-bold mb-1'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <div>
          <label className='block font-bold mb-1'>Senha</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <div>
          <label className='block font-bold mb-1'>Confirmar Senha</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-500'>{success}</p>}
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
