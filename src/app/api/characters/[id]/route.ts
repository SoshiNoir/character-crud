import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const user = await prisma.character.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao buscar personagem:', error)
    return NextResponse.json({ error: 'Erro ao buscar personagem' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedCharacter = await prisma.character.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(updatedCharacter, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating character' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
