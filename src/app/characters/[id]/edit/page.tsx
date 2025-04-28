'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Character {
  id: number;
  name: string;
  profession: string;
  likes: string;
  dislikes: string;
  description: string;
  image: string;
}

const EditCharacterPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    likes: '',
    dislikes: '',
    description: '',
    image: '',
  });
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/characters/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar personagem.');
        }

        const data = await response.json();
        setCharacter(data);
        setFormData({
          name: data.name,
          profession: data.profession,
          likes: data.likes,
          dislikes: data.dislikes,
          description: data.description,
          image: data.image,
        });
      } catch (error) {
        setError('Erro ao carregar personagem.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCharacter();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Se uma nova imagem foi selecionada, faça o upload
      if (newImage) {
        const formData = new FormData();
        formData.append('file', newImage);
        formData.append('characterId', id); // Associa a imagem ao personagem

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload da imagem.');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl; // URL da nova imagem
      }

      // Atualize os dados do personagem
      const response = await fetch(`/api/characters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar personagem.');
      }

      alert('Personagem atualizado com sucesso!');
      router.push(`/characters/${id}`); // Redireciona para a página de detalhes
    } catch (error) {
      alert('Erro ao atualizar personagem.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p className='text-red-500'>{error}</p>;
  }

  if (!character) {
    return <p>Personagem não encontrado</p>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Editar Personagem</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
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
        <div>
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
        <div>
          <label className='block font-bold mb-1'>Likes</label>
          <input
            type='text'
            name='likes'
            value={formData.likes}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <div>
          <label className='block font-bold mb-1'>Dislikes</label>
          <input
            type='text'
            name='dislikes'
            value={formData.dislikes}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <div>
          <label className='block font-bold mb-1'>Descrição</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <div>
          <label className='block font-bold mb-1'>Imagem Atual</label>
          <Image
            src={formData.image}
            alt='Imagem atual'
            className='w-32 h-32 object-cover rounded mb-4'
            width={300}
            height={300}
          />
        </div>
        <div>
          <label className='block font-bold mb-1'>Nova Imagem (opcional)</label>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='w-full border p-2 rounded'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
};

export default EditCharacterPage;
