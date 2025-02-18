import type { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ChangeNotificationsSettingsInput } from './inputs/change-notifications-settings.input'
import { ChangeNotificationsSettingsResponse } from './models/notification-settings.model'
import { NotificationModel } from './models/notification.model'
import { NotificationService } from './notification.service'

@Resolver('Notification')
export class NotificationResolver {
  public constructor(private readonly notificationService: NotificationService) {}

  @Authorization()
  @Query(() => Number, { name: 'findNotificationsUnreadCount' })
  public async findUnreadCount(@Authorized('id') userId: string) {
    return this.notificationService.findUnreadCount(userId)
  }

  @Authorization()
  @Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
  public async findByUser(@Authorized('id') userId: string) {
    return this.notificationService.findByUser(userId)
  }

  @Authorization()
  @Mutation(() => ChangeNotificationsSettingsResponse, { name: 'changeNotificationSettings' })
  public async changeSettings(@Authorized() user: User, @Args('data') input: ChangeNotificationsSettingsInput) {
    return this.notificationService.changeSettings(user, input)
  }
}
