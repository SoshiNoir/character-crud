'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Character {
  id: number;
  name: string;
  profession: string;
  likes: string;
  dislikes: string;
  description: string;
  image: string;
}

const CharactersPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || ''; // Captura o parâmetro "search" da URL
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/characters?search=${searchQuery}&page=${page}`
        );
        if (!response.ok) {
          throw new Error('Erro ao carregar personagens.');
        }

        const data = await response.json();
        setCharacters(data.characters);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError('Erro ao carregar personagens.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [searchQuery, page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>
        {searchQuery
          ? `Resultados para "${searchQuery}"`
          : 'Lista de Personagens'}
      </h1>

      {loading && <p>Carregando...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      <div className='grid grid-cols-3 gap-4'>
        {characters.map((character) => (
          <Link
            key={character.id}
            href={`/characters/${character.id}`}
            className='border p-4 rounded shadow hover:shadow-lg transition-shadow'
          >
            <div>
              <Image
                src={character.image}
                alt={character.name}
                className='w-full h-48 object-cover rounded mb-4'
                width={500}
                height={500}
              />
              <h2 className='text-xl font-bold'>{character.name}</h2>
              <p className='text-gray-600'>{character.profession}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className='flex justify-between items-center mt-6'>
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className='bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50'
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className='bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50'
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default CharactersPage;
