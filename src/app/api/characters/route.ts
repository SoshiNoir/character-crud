import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Listar todos os personagens com paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 9;
    const skip = (page - 1) * limit;

    const characters = await prisma.character.findMany({
      skip,
      take: limit,
    });

    const totalCharacters = await prisma.character.count();

    return NextResponse.json({
      characters,
      total: totalCharacters,
      page,
      totalPages: Math.ceil(totalCharacters / limit),
    });
  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    return NextResponse.json({ error: 'Erro ao buscar personagens' }, { status: 500 });
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
