import { PrismaService } from '@/src/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Ctx, Start, Update } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'

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
    const username = ctx.message.from.username

    await ctx.replyWithHTML(`qq ${username}`)
  }
}
