'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { HiSearch } from 'react-icons/hi';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className='bg-color-300 text-white shadow-lg p-4'>
      <div className='container flex items-center'>
        {/* Logo no canto esquerdo */}
        <div className='text-2xl font-bold'>
          <Link href='/' className='text-color-gray'>
            Crudters
          </Link>
        </div>

        {/* Menu de navegação */}
        <div className='flex space-x-6 ml-10'>
          <Link href='/' className='text-white hover:text-gray-200'>
            Home
          </Link>
          <Link href='/characters' className='text-white hover:text-gray-200'>
            Personagens
          </Link>
        </div>

        {/* Barra de pesquisa*/}
        <div className='flex-grow flex justify-center'>
          <div className='relative w-full max-w-lg'>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
              className='w-full py-2 px-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300'
              placeholder='Buscar personagem...'
            />
            <div className='absolute top-1/2 right-4 transform -translate-y-1/2'>
              <HiSearch className='text-gray-500' size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
