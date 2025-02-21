import { PrismaService } from '@/src/core/prisma/prisma.service'

import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { MailService } from '../libs/mail/mail.service'
import { StorageService } from '../libs/storage/storage.service'
import { TelegramService } from '../libs/telegram/telegram.service'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class CronService {
  public constructor(
    private readonly mailService: MailService,
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly telegramService: TelegramService,
    private readonly notificationService: NotificationService
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

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async verifyChannels() {
    const users = await this.prismaService.user.findMany({
      include: {
        notificationSettings: true,
      },
    })

    for (const user of users) {
      const followersCount = await this.prismaService.follow.count({
        where: {
          followingId: user.id,
        },
      })

      if (followersCount > 10 && !user.isVerified) {
        await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            isVerified: true,
          },
        })

        await this.mailService.sendVerifyChannel(user.email)

        if (user.notificationSettings.siteNotifications) {
          await this.notificationService.createVerifyChannel(user.id)
        }

        if (user.notificationSettings.telegramNotifications && user.telegramId) {
          await this.telegramService.sendVerifyChannel(user.telegramId)
        }
      }
    }
  }
}
