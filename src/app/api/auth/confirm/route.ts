import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Código de confirmação inválido.' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { confirmationCode: code },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Código de confirmação inválido.' },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isConfirmed: true,
      confirmationCode: null,
    },
  });

  return NextResponse.json({ message: 'Conta confirmada com sucesso!' });
}