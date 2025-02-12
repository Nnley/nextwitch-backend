import { TokenType, type User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.utils'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils'
import { destroySession } from '@/src/shared/utils/session.utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'
import { MailService } from '../../libs/mail/mail.service'
import { DeactivateAccountInput } from './inputs/deactivate-account.input'

@Injectable()
export class DeactivateService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService
  ) {}

  public async deactivate(req: Request, input: DeactivateAccountInput, user: User, userAgent: string) {
    const { email, password, pin } = input

    if (user.email !== email) {
      throw new BadRequestException('Email does not match')
    }

    const isValidPassword = await verify(user.password, password)

    if (!isValidPassword) {
      throw new BadRequestException('Invalid password')
    }

    if (!pin) {
      await this.sendDeactivateToken(req, user, userAgent)

      return { message: 'Please check your email for a deactivation link.' }
    }

    await this.validateDeactivateToken(req, pin)

    return { user, message: 'Account deactivated successfully' }
  }

  private async validateDeactivateToken(req: Request, token: string) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.DEACTIVATE_ACCOUNT,
      },
    })

    if (!existingToken) {
      throw new NotFoundException('Token not found')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException('Token has expired')
    }

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: {
          id: existingToken.userId,
        },
        data: {
          isDeactivated: true,
          deactivatedAt: new Date(),
        },
      }),
      this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.DEACTIVATE_ACCOUNT,
        },
      }),
    ])

    return destroySession(req, this.configService)
  }

  public async sendDeactivateToken(req: Request, user: User, userAgent: string) {
    const token = await generateToken(this.prismaService, user, TokenType.DEACTIVATE_ACCOUNT)

    const metadata = getSessionMetadata(req, userAgent)

    await this.mailService.sendDeactivateToken(user.email, token.token, metadata)

    return true
  }
}
