// File: C:\Projetos\character-crud\src\app\api\characters\[id]\route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Obter um personagem pelo ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 });
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error('Erro ao buscar personagem:', error);
    return NextResponse.json({ error: 'Erro ao buscar personagem' }, { status: 500 });
  }
}

// PUT: Atualizar um personagem pelo ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const body = await request.json();
    const { name, profession, likes, dislikes, description, image } = body;

    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: { name, profession, likes, dislikes, description, image },
    });

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error('Erro ao atualizar personagem:', error);
    return NextResponse.json({ error: 'Erro ao atualizar personagem' }, { status: 500 });
  }
}

// DELETE: Deletar um personagem pelo ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Personagem deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar personagem:', error);
    return NextResponse.json({ error: 'Erro ao deletar personagem' }, { status: 500 });
  }
}
