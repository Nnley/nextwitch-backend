import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils'
import { destroySession, saveSession } from '@/src/shared/utils/session.utils'
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'
import { TOTP } from 'otpauth'
import { VerificationService } from '../verification/verification.service'
import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly verificationService: VerificationService
  ) {}

  public async findByUser(req: Request) {
    const userId = req.session.userId

    if (!userId) {
      throw new NotFoundException('User not found')
    }

    const keys = await this.redisService.keys('*')

    const userSessions = []

    for (const key of keys) {
      const sessionData = await this.redisService.get(key)

      if (sessionData) {
        const session = JSON.parse(sessionData)

        if (session.userId === userId) {
          userSessions.push({ ...session, id: key.split(':')[1] })
        }
      }
    }

    userSessions.sort((a, b) => b.createdAt - a.createdAt)

    return userSessions.filter(session => session.id !== req.session.id)
  }

  public async findCurrent(req: Request) {
    const sessionId = req.session.id

    const sessionData = await this.redisService.get(
      `${this.configService.getOrThrow<string>('SESSION_PREFIX')}${sessionId}`
    )

    const session = JSON.parse(sessionData)

    return {
      ...session,
      id: sessionId,
    }
  }

  public async login(req: Request, input: LoginInput, userAgent: string) {
    const { login, password, pin } = input

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login, mode: 'insensitive' } }, { email: { equals: login, mode: 'insensitive' } }],
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const isValidPassword = await verify(user.password, password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password')
    }

    if (!user.isEmailVerified) {
      await this.verificationService.sendVerificationToken(user)

      throw new BadRequestException('Email not verified. Please check your email for a verification link.')
    }

    if (user.isTotpEnabled) {
      if (!pin) {
        return { message: 'Please enter your TOTP code' }
      }

      const totp = new TOTP({
        issuer: 'NexTwitch',
        label: `${user.username}`,
        algorithm: 'SHA1',
        digits: 6,
        secret: user.totpSecret,
      })

      const delta = totp.validate({ token: pin })

      if (delta === null) {
        throw new BadRequestException('Invalid code')
      }
    }

    const metadata = getSessionMetadata(req, userAgent)
    const savedUser = await saveSession(req, user, metadata)

    return { user: savedUser, message: null }
  }

  public async logout(req: Request) {
    return destroySession(req, this.configService)
  }

  public async clearSession(req: Request) {
    req.res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))

    return true
  }

  public async remove(req: Request, id: string) {
    if (req.session.id === id) {
      throw new ConflictException('Cannot remove current session')
    }

    await this.redisService.del(`${this.configService.getOrThrow<string>('SESSION_PREFIX')}${id}`)

    return true
  }
}
