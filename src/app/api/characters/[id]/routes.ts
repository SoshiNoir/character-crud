// app/api/characters/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // Alterado para importação nomeada


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json(); // Extrai os dados enviados na requisição

    // Atualiza o personagem no banco de dados
    const updatedCharacter = await prisma.character.update({
      where: { id: parseInt(id) }, // Conversão para inteiro
      data: body, // Dados para atualizar
    });

    return NextResponse.json(updatedCharacter, { status: 200 }); // Retorna o personagem atualizado
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating character' }, { status: 500 });
  }
}

// Caso o método não seja PUT
export async function OPTIONS() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
