import { PrismaService } from '@/src/core/prisma/prisma.service'

import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { MailService } from '../libs/mail/mail.service'
import { StorageService } from '../libs/storage/storage.service'
import { TelegramService } from '../libs/telegram/telegram.service'

@Injectable()
export class CronService {
  public constructor(
    private readonly mailService: MailService,
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly telegramService: TelegramService
  ) {}

  @Cron('0 0 * * *')
  public async deleteDeactivateAccounts() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
      include: {
        notificationSettings: true,
        stream: true,
      },
    })

    for (const account of deactivatedAccounts) {
      await this.mailService.sendAccountDeletion(account.email)

      if (account.notificationSettings.telegramNotifications && account.telegramId) {
        await this.telegramService.sendAccountDeletion(account.telegramId)
      }

      if (account.avatarUrl) {
        this.storageService.remove(account.avatarUrl)
      }

      if (account.stream.thumbnailUrl) {
        this.storageService.remove(account.stream.thumbnailUrl)
      }
    }

    await this.prismaService.user.deleteMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
    })
  }
}
