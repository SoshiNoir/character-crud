import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const characters = await prisma.character.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive', // Busca sem diferenciar maiúsculas e minúsculas
        },
      },
      select: {
        id: true,
        name: true,
        image: true, // Inclui o campo de imagem
      },
      take: 10, // Limita a busca a 10 resultados
    });

    return NextResponse.json(characters);
  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    return NextResponse.json({ error: 'Erro ao buscar personagens.' }, { status: 500 });
  }
}