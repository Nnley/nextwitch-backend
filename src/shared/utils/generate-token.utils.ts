import type { TokenType, User } from '@/prisma/generated'
import type { PrismaService } from '@/src/core/prisma/prisma.service'
import { v4 as uuidv4 } from 'uuid'

export async function generateToken(
  prismaService: PrismaService,
  user: User,
  type: TokenType,
  isUUID: boolean = false
) {
  let token: string

  if (isUUID) {
    token = uuidv4()
  } else {
    token = Math.floor(Math.random() * (1_000_000 - 100_000) + 100_000).toString()
  }

  const expiresIn = new Date(new Date().getTime() + 1000 * 300)

  const existingToken = await prismaService.token.findFirst({
    where: {
      type,
      user: {
        id: user.id,
      },
    },
  })

  if (existingToken) {
    await prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const newToken = await prismaService.token.create({
    data: {
      token,
      type,
      expiresIn,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      user: {
        include: {
          notificationSettings: true,
        },
      },
    },
  })

  return newToken
}
