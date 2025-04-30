import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || ''; 
  const page = parseInt(searchParams.get('page') || '1'); // Captura o parâmetro "page"
  const pageSize = 10; // Define o número de itens por página

  try {
    // Filtro de busca
    const where = search
      ? {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive, // Corrigido para usar "insensitive" em minúsculas
        },
      }
      : {};

    // Busca os personagens com paginação
    const characters = await prisma.character.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Conta o total de personagens para calcular o número de páginas
    const totalCharacters = await prisma.character.count({ where });
    const totalPages = Math.ceil(totalCharacters / pageSize);

    return NextResponse.json({ characters, totalPages });
  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    return NextResponse.json({ error: 'Erro ao buscar personagens.' }, { status: 500 });
  }
}

// POST: Criar um novo personagem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, profession, likes, dislikes, description, image } = body;

    // Validação: Verifica se todos os campos obrigatórios estão presentes
    if (!name || !profession || !likes || !dislikes || !description || !image) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    const newCharacter = await prisma.character.create({
      data: {
        name,
        profession,
        likes,
        dislikes,
        description,
        image,
      },
    });

    return NextResponse.json(newCharacter, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar personagem:', error);
    return NextResponse.json({ error: 'Erro ao criar personagem.' }, { status: 500 });
  }
}
