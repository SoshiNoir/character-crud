'use client';

import Button from '@/components/Button';
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

interface Post {
  id: number;
  content: string;
  createdAt: string;
}

const CharacterDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<number | null>(null); // Para editar posts
  const [loadingPosts, setLoadingPosts] = useState(false);

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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await fetch(
          `/api/characters/${id}/posts?page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error('Erro ao buscar posts.');
        }
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [id, currentPage]);

  const handleCreatePost = async () => {
    try {
      const response = await fetch(`/api/characters/${id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar post.');
      }

      const newPost: Post = await response.json();
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  const handleEditPost = async (postId: number, updatedContent: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (!response.ok) {
        throw new Error('Erro ao editar post.');
      }

      const updatedPost: Post = await response.json();
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
      setEditingPost(null);
    } catch (error) {
      console.error('Erro ao editar post:', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar post.');
      }

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

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
          <Button
            onClick={() => router.push(`/characters/${id}/edit`)}
            bgColor='bg-color-200'
            hoverColor='hover:bg-color-100'
            textColor='text-white'
          >
            Editar
          </Button>
          <Button
            onClick={() => setShowDeletePopup(true)}
            bgColor='bg-red-500'
            hoverColor='hover:bg-red-600'
            textColor='text-white'
          >
            Deletar
          </Button>
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

      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Posts</h2>

        {/* Card para criar novo post */}
        <div className='bg-white p-6 rounded-lg shadow-lg mb-6'>
          <h3 className='text-lg font-bold mb-2'>Criar Novo Post</h3>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className='w-full border p-2 rounded resize-none' // `resize-none` impede o redimensionamento
            placeholder='Escreva um novo post...'
            rows={3} // Define uma altura fixa
          />
          <button
            onClick={handleCreatePost}
            className='bg-color-200 text-white px-4 py-2 rounded mt-2'
          >
            Publicar
          </button>
        </div>

        {/* Listar posts */}
        {loadingPosts ? (
          <p>Carregando posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className='bg-white p-6 rounded-lg shadow-lg mb-6 flex items-center gap-4'
            >
              {/* Miniatura da imagem do personagem */}
              <Image
                src={character?.image || '/placeholder.png'} // Use uma imagem padrão se `character.image` for nulo
                alt={character?.name || 'Personagem'}
                width={40}
                height={40}
                className='rounded-full'
              />
              <div className='flex-1'>
                {editingPost === post.id ? (
                  <div>
                    <textarea
                      defaultValue={post.content}
                      onBlur={(e) => handleEditPost(post.id, e.target.value)}
                      className='w-full border p-2 rounded resize-none'
                      rows={3} // Define uma altura fixa para edição
                    />
                  </div>
                ) : (
                  <p className='text-gray-800'>{post.content}</p>
                )}
                <p className='text-sm text-gray-500'>
                  Publicado em: {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              <div className='flex gap-2'>
                <Button
                  onClick={() => setEditingPost(post.id)}
                  bgColor='bg-color-200'
                  hoverColor='hover:bg-color-100'
                  textColor='text-white'
                >
                  Editar
                </Button>
                <Button
                  onClick={() => handleDeletePost(post.id)}
                  bgColor='bg-red-500'
                  hoverColor='hover:bg-red-600'
                  textColor='text-white'
                >
                  Apagar
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>Nenhum post encontrado.</p>
        )}

        {/* Paginação */}
        <div className='flex justify-between mt-4'>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            bgColor='bg-gray-300'
            hoverColor='hover:bg-gray-400'
            textColor='text-gray-700'
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            bgColor='bg-gray-300'
            hoverColor='hover:bg-gray-400'
            textColor='text-gray-700'
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailsPage;
