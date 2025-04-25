// Arquivo: src/app/api/characters/route.ts (Next.js 13+ app directory)
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET - Lista todos os personagens
export async function GET() {
  const characters = await prisma.character.findMany({
    include: { posts: true },
  });
  return NextResponse.json(characters);
}

// POST - Cria um novo personagem
export async function POST(req: Request) {
  const body = await req.json();

  const newCharacter = await prisma.character.create({
    data: {
      name: body.name,
      profession: body.profession,
      likes: body.likes,
      dislikes: body.dislikes,
      description: body.description,
      image: body.image || '',
    },
  });

  return NextResponse.json(newCharacter);
}
