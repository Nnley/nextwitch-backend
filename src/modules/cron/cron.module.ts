import { PrismaService } from '@/src/core/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { StorageService } from '../libs/storage/storage.service'
import { TelegramService } from '../libs/telegram/telegram.service'
import { NotificationService } from '../notification/notification.service'
import { CronService } from './cron.service'

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, PrismaService, StorageService, TelegramService, NotificationService],
})
export class CronModule {}
