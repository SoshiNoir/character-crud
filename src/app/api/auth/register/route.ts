import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Verifica se o e-mail já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'E-mail já registrado.' },
      { status: 400 }
    );
  }

  // Gera um código de confirmação
  const confirmationCode = crypto.randomBytes(20).toString('hex');

  // Salva o usuário no banco de dados com status "pendente"
  await prisma.user.create({
    data: {
      email,
      password, // Certifique-se de hashear a senha antes de salvar
      confirmationCode,
      isConfirmed: false,
    },
  });

  // Configura o transporte de e-mail
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ou outro serviço de e-mail
    auth: {
      user: process.env.EMAIL_USER, // Configure no .env
      pass: process.env.EMAIL_PASS, // Configure no .env
    },
  });

  // Envia o e-mail de confirmação
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmação de Registro',
    html: `
      <h1>Confirme seu registro</h1>
      <p>Clique no link abaixo para confirmar sua conta:</p>
      <a href="${process.env.BASE_URL}/api/auth/confirm?code=${confirmationCode}">
        Confirmar Conta
      </a>
    `,
  });

  return NextResponse.json({ message: 'Usuário registrado. Verifique seu e-mail para confirmar a conta.' });
}