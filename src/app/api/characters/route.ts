import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const characters = await prisma.character.findMany()
    return NextResponse.json(characters)
  } catch (error) {
    console.error('Erro ao buscar personagem:', error)
    return NextResponse.json({ error: 'Erro ao buscar personagens' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, profession, likes, dislikes, description, image, posts, createdAt } = body

    if (!name || !profession || !likes || !dislikes || !description || !image) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 })
    }

    const newUser = await prisma.character.create({
      data: {
        name,
        profession,
        likes,
        dislikes,
        description,
        image,
        posts,
        createdAt,
      },
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}