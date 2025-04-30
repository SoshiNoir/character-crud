'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Salva o token no localStorage
      router.push('/characters'); // Redireciona para a página de personagens
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Login</h1>
      <form onSubmit={handleLogin} className='space-y-4'>
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
        {error && <p className='text-red-500'>{error}</p>}
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
