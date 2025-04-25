import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Exemplo de dados de personagens (isso pode ser substituído por um banco de dados ou algo persistente no futuro)
const characters = [
  { id: 1, name: 'Personagem 1', image: '/images/character1.jpg' },
  { id: 2, name: 'Personagem 2', image: '/images/character2.jpg' },
  { id: 3, name: 'Personagem 3', image: '/images/character3.jpg' },
];

const CharactersPage = () => {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        Lista de Personagens
      </h1>
      <div className='grid grid-cols-3 gap-6'>
        {characters.map((character) => (
          <Link
            key={character.id}
            href={`/characters/${character.id}`}
            passHref
          >
            <div className='border p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300'>
              <Image
                src={character.image}
                alt={character.name}
                width={600}
                height={600}
                className='w-full h-64 object-cover rounded-md mb-4'
              />
              <h2 className='text-xl font-semibold text-center'>
                {character.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CharactersPage;
