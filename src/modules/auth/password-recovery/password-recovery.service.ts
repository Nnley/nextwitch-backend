import { TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.utils'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import type { Request } from 'express'
import { MailService } from '../../libs/mail/mail.service'
import { TelegramService } from '../../libs/telegram/telegram.service'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { UpdatePasswordInput } from './inputs/update-password.input'

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly telegramService: TelegramService
  ) {}

  public async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string) {
    const { email } = input

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const resetToken = await generateToken(this.prismaService, user, TokenType.PASSWORD_RESET, true)

    const metadata = getSessionMetadata(req, userAgent)

    await this.mailService.sendResetPasswordToken(user.email, resetToken.token, metadata)

    if (resetToken.user.notificationSettings.telegramNotifications && resetToken.user.telegramId) {
      await this.telegramService.sendPasswordResetToken(resetToken.user.telegramId, resetToken.token, metadata)
    }

    return true
  }

  public async updatePassword(input: UpdatePasswordInput) {
    const { token, password } = input

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
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
          password: await hash(password),
        },
      }),
      this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.PASSWORD_RESET,
        },
      }),
    ])

    return true
  }
}
