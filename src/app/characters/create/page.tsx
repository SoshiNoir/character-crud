'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CreateCharacterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    likes: '',
    dislikes: '',
    description: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ownerId: 1, // Substitua pelo ID do usuário logado
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar personagem.');
      }

      alert('Personagem criado com sucesso!');
      router.push('/characters'); // Redireciona para a lista de personagens
    } catch (error) {
      setError('Erro ao criar personagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-6'>Criar Personagem</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Card para o campo Nome */}
          <div className='bg-gray-100 p-4 rounded-lg shadow'>
            <label className='block font-bold mb-1'>Nome</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full border p-2 rounded'
              required
            />
          </div>

          {/* Card para o campo Profissão */}
          <div className='bg-gray-100 p-4 rounded-lg shadow'>
            <label className='block font-bold mb-1'>Profissão</label>
            <input
              type='text'
              name='profession'
              value={formData.profession}
              onChange={handleChange}
              className='w-full border p-2 rounded'
              required
            />
          </div>

          {/* Card para o campo Gostos */}
          <div className='bg-gray-100 p-4 rounded-lg shadow'>
            <label className='block font-bold mb-1'>Gostos</label>
            <input
              type='text'
              name='likes'
              value={formData.likes}
              onChange={handleChange}
              className='w-full border p-2 rounded'
              required
            />
          </div>

          {/* Card para o campo Desgostos */}
          <div className='bg-gray-100 p-4 rounded-lg shadow'>
            <label className='block font-bold mb-1'>Desgostos</label>
            <input
              type='text'
              name='dislikes'
              value={formData.dislikes}
              onChange={handleChange}
              className='w-full border p-2 rounded'
              required
            />
          </div>

          {/* Card para o campo Descrição */}
          <div className='bg-gray-100 p-4 rounded-lg shadow'>
            <label className='block font-bold mb-1'>Descrição</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              className='w-full border p-2 rounded'
              required
            />
          </div>

          {/* Card para o campo Imagem */}
          <div className='bg-gray-100 p-4 rounded-lg shadow'>
            <label className='block font-bold mb-1'>Imagem</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full border p-2 rounded'
            />
          </div>

          {/* Botão de criar */}
          <div className='bg-gray-100 p-4 rounded-lg shadow'>
            <button
              type='submit'
              className='bg-color-200 hover:bg-color-100 text-white px-4 py-2 rounded'
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
        {error && <p className='text-red-500 mt-4'>{error}</p>}
      </div>
    </div>
  );
};

export default CreateCharacterPage;
