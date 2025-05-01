'use client';

import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { HiSearch } from 'react-icons/hi';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica se o token existe no localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleSearch = async (term: string) => {
    if (term.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await fetch(`/api/characters/search?query=${term}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar personagens.');
      }

      const data = await response.json();
      setSearchResults(data.slice(0, 3));
      setShowDropdown(true);
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleNavigation = () => {
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    setIsLoggedIn(false); // Atualiza o estado
    router.push('/login'); // Redireciona para a página de login
  };

  return (
    <header className='bg-color-300 text-white shadow-lg p-4'>
      <div className='container flex items-center'>
        <div className='text-2xl font-bold'>
          <Link href='/' className='text-color-gray'>
            Crudters
          </Link>
        </div>
        <div className='flex space-x-6 ml-10'>
          <Button
            onClick={() => router.push('/')}
            bgColor='bg-color-200'
            hoverColor='hover:bg-color-100'
            textColor='text-white'
          >
            Home
          </Button>
          <Button
            onClick={() => router.push('/characters')}
            bgColor='bg-color-200'
            hoverColor='hover:bg-color-100'
            textColor='text-white'
          >
            Personagens
          </Button>
        </div>
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
              <Link href={`/characters?search=${searchTerm}`}>
                <HiSearch className='text-gray-500 cursor-pointer' size={20} />
              </Link>
            </div>
            {showDropdown && searchResults.length > 0 && (
              <div className='absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10'>
                <ul>
                  {searchResults.map(
                    (result: { id: number; name: string; image: string }) => (
                      <Link
                        key={result.id}
                        href={`/characters/${result.id}`}
                        className='flex items-center px-4 py-2 hover:bg-gray-100'
                        onClick={handleNavigation}
                      >
                        <Image
                          src={result.image || '/placeholder.png'}
                          alt={result.name}
                          className='w-14 h-14 rounded-full mr-3'
                          width={100}
                          height={100}
                        />
                        <span className='text-gray-700'>{result.name}</span>
                      </Link>
                    )
                  )}
                </ul>
                <div className='border-t border-gray-300'>
                  <Link
                    href={`/characters?search=${searchTerm}`}
                    className='block text-center text-blue-500 py-2 hover:bg-gray-100'
                    onClick={handleNavigation}
                  >
                    Ver todos os resultados
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          {/* Botão Criar */}
          <Button
            onClick={() =>
              isLoggedIn
                ? router.push('/characters/create')
                : router.push('/login')
            }
            bgColor='bg-color-200'
            hoverColor='hover:hover:bg-color-100'
            textColor='text-white'
          >
            Criar
          </Button>

          {/* Botão Perfil */}
          {isLoggedIn ? (
            <Link href='/profile' className='flex items-center space-x-2'>
              <FaUserCircle size={24} />
            </Link>
          ) : (
            <Link href='/login' className='text-white hover:text-gray-200'>
              Login
            </Link>
          )}

          {/* Botão Sair */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className='flex items-center space-x-2 text-white hover:text-gray-200'
            >
              <FiLogOut size={24} />
              <span>Sair</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
