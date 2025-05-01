import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || 'default-secret'; // Use uma chave padrão como fallback

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
  }

  const token = jwt.sign(
    {
      userId: user.id, // ID do usuário
      email: user.email, // Email do usuário
    },
    SECRET_KEY,
    { expiresIn: '1h' } // Expiração do token
  );

  return NextResponse.json({ token });
}