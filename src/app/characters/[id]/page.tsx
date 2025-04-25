'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
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

const characters: Character[] = [
  {
    id: 1,
    name: 'Personagem 1',
    profession: 'Guerreiro',
    likes: 'Lutar, espadas, honra',
    dislikes: 'Perder, magia, injustiça',
    description: 'Personagem valente e destemido.',
    image: '/images/character1.jpg',
  },
  {
    id: 2,
    name: 'Personagem 2',
    profession: 'Mago',
    likes: 'Magia',
    dislikes: 'Injustiça',
    description: 'Mestre das artes arcanas.',
    image: '/images/character2.jpg',
  },
  {
    id: 3,
    name: 'Personagem 3',
    profession: 'Arqueiro',
    likes: 'Aventuras',
    dislikes: 'Cegueira',
    description: 'Mestre dos arcos e flechas.',
    image: '/images/character3.jpg',
  },
];

const CharacterDetailsPage = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (id) {
      const characterId = Array.isArray(id) ? id[0] : id;
      const characterData = characters.find(
        (char) => char.id === parseInt(characterId)
      );
      setCharacter(characterData || null);
    }
  }, [id]);

  if (!character) {
    return <p>Personagem não encontrado</p>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>{character.name}</h1>
      <div className='flex items-center border p-6 rounded-lg shadow-lg'>
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
      </div>
    </div>
  );
};

export default CharacterDetailsPage;
