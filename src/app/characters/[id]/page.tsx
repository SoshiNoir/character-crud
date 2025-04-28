'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';

interface Character {
  id: number;
  name: string;
  profession: string;
  likes: string;
  dislikes: string;
  description: string;
  image: string;
}

const CharacterDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/characters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar personagem.');
      }

      alert('Personagem deletado com sucesso!');
      router.push('/characters'); // Redireciona para a lista de personagens
    } catch (error) {
      alert('Erro ao deletar personagem.');
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
      <h1 className='text-3xl font-bold mb-6'>{character.name}</h1>
      <div className='flex items-center border p-6 rounded-lg shadow-lg'>
        <div></div>

        {/* Imagem do personagem */}
        <div className='w-1/3'>
          <Image
            src={character.image}
            alt={character.name}
            className='object-contain w-full h-full mx-auto rounded-md'
            width={400}
            height={400}
          />
        </div>

        {/* Informações do personagem */}

        <div className='w-2/3 pl-6'>
          <p>
            <strong>Profissão:</strong> {character.profession}
          </p>
          <div className='flex items-center gap-1'>
            <FaRegThumbsUp />
            <p>{character.likes}</p>
          </div>
          <div className='flex items-center gap-1'>
            <FaRegThumbsDown />
            <p>{character.dislikes}</p>
          </div>
          <p>
            <strong>Descrição:</strong> {character.description}
          </p>
        </div>
        {/* Botões de ação */}
        <div className='mt-6 flex gap-4'>
          <button
            onClick={() => router.push(`/characters/${id}/edit`)}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Editar
          </button>
          <button
            onClick={() => setShowDeletePopup(true)}
            className='bg-red-500 text-white px-4 py-2 rounded'
          >
            Deletar
          </button>
        </div>
      </div>

      {/* Pop-up de confirmação para deletar */}
      {showDeletePopup && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded shadow-lg'>
            <p className='mb-4'>
              Tem certeza que deseja deletar este personagem?
            </p>
            <div className='flex gap-4 items-center justify-center'>
              <button
                onClick={handleDelete}
                className='bg-red-500 text-white px-4 py-2 rounded'
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className='bg-gray-300 text-gray-700 px-4 py-2 rounded'
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterDetailsPage;
