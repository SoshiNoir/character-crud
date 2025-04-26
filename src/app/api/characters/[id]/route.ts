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
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const existingCharacter = await prisma.character.findUnique({
      where: { id },
    });

    if (!existingCharacter) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 });
    }

    const body = await req.json();

    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedCharacter, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar personagem:', error);
    return NextResponse.json({ error: 'Erro ao atualizar personagem' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const existingCharacter = await prisma.character.findUnique({
      where: { id },
    });

    if (!existingCharacter) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 });
    }

    await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Personagem deletado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar personagem:', error);
    return NextResponse.json({ error: 'Erro ao deletar personagem' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
