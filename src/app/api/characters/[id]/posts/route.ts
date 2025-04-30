import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const characterId = parseInt(params.id);
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 10;

  if (isNaN(characterId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: { characterId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPosts = await prisma.post.count({ where: { characterId } });

    return NextResponse.json({
      posts,
      totalPages: Math.ceil(totalPosts / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json({ error: 'Erro ao buscar posts.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const characterId = parseInt(params.id);
  const body = await request.json();

  if (isNaN(characterId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        content: body.content,
        mediaUrl: body.mediaUrl || null,
        characterId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json({ error: 'Erro ao criar post.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId);
  const body = await request.json();

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'ID do post inválido.' }, { status: 400 });
  }

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        content: body.content,
        mediaUrl: body.mediaUrl || null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Erro ao editar post:', error);
    return NextResponse.json({ error: 'Erro ao editar post.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId);

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'ID do post inválido.' }, { status: 400 });
  }

  try {
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: 'Post deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    return NextResponse.json({ error: 'Erro ao deletar post.' }, { status: 500 });
  }
}