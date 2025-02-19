import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf'
import { Context, Telegraf } from 'telegraf'
import { BUTTONS } from './telegram.buttons'
import { MESSAGES } from './telegram.messages'

@Update()
@Injectable()
export class TelegramService extends Telegraf {
  private readonly _token: string

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {
    super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
    this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
  }

  @Start()
  public async onStart(@Ctx() ctx: any) {
    const chatId = ctx.message.from.id.toString()
    const token = ctx.message.text.split(' ')[1]

    if (token) {
      const authToken = await this.prismaService.token.findUnique({
        where: {
          token,
          type: TokenType.TELEGRAM_AUTH,
        },
      })

      const hasExpired = new Date(authToken.expiresIn) < new Date()

      if (!authToken) {
        ctx.reply(MESSAGES.invalidToken)
        return
      }

      if (hasExpired) {
        ctx.reply(MESSAGES.invalidToken)
        return
      }

      await this.connectTelegram(authToken.userId, chatId)

      await this.prismaService.token.delete({
        where: {
          id: authToken.id,
        },
      })

      await ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess)
    } else {
      const user = await this.findUserByChatId(chatId)

      if (user) {
        const followersCount = await this.prismaService.follow.count({
          where: {
            followingId: user.id,
          },
        })
        await ctx.replyWithHTML(MESSAGES.profile(user, followersCount), BUTTONS.profile)
      } else {
        await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
      }
    }
  }

  @Command('me')
  @Action('me')
  public async onMe(@Ctx() ctx: Context) {
    const chatId = ctx.message.from.id.toString()

    const user = await this.findUserByChatId(chatId)

    const followersCount = await this.prismaService.follow.count({
      where: {
        followingId: user.id,
      },
    })

    await ctx.replyWithHTML(MESSAGES.profile(user, followersCount), BUTTONS.profile)
  }

  @Command('follows')
  @Action('follows')
  public async onFollow(@Ctx() ctx: Context) {
    const chatId = ctx.message.from.id.toString()

    const user = await this.findUserByChatId(chatId)
    const follows = await this.prismaService.follow.findMany({
      where: {
        followerId: user.id,
      },
      include: {
        following: true,
      },
    })

    if (user && follows.length) {
      const followList = follows.map(follow => MESSAGES.follows(follow.following)).join('\n')
      const message = `<b> Каналы на которые вы подписаны:</b>\n\n${followList}`

      await ctx.replyWithHTML(message)
    } else {
      await ctx.replyWithHTML('<b>Вы не подписаны ни на один канал.</b>')
    }
  }

  public async sendPasswordResetToken(chatId: string, token: string, metadata: SessionMetadata) {
    await this.telegram.sendMessage(chatId, MESSAGES.resetPassword(token, metadata), { parse_mode: 'HTML' })
  }

  public async sendDeactivateToken(chatId: string, token: string, metadata: SessionMetadata) {
    await this.telegram.sendMessage(chatId, MESSAGES.deactivate(token, metadata), { parse_mode: 'HTML' })
  }

  public async sendAccountDeletion(chatId: string) {
    await this.telegram.sendMessage(chatId, MESSAGES.accountDeleted, { parse_mode: 'HTML' })
  }

  public async sendStreamStart(chatId: string, channel: User) {
    await this.telegram.sendMessage(chatId, MESSAGES.streamStart(channel), { parse_mode: 'HTML' })
  }

  public async sendNewFollowing(chatId: string, follower: User) {
    const user = await this.findUserByChatId(chatId)

    await this.telegram.sendMessage(chatId, MESSAGES.newFollowing(follower, user.followers.length), {
      parse_mode: 'HTML',
    })
  }

  private async findUserByChatId(chatId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        telegramId: chatId,
      },
      include: {
        followers: true,
        followings: true,
      },
    })

    return user
  }

  private async connectTelegram(userId: string, chatId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        telegramId: chatId,
      },
    })
  }
}
