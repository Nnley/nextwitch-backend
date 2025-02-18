import type { NotificationSettings } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NotificationSettingsModel extends BaseType implements NotificationSettings {
  @Field(() => Boolean)
  siteNotifications: boolean

  @Field(() => Boolean)
  telegramNotifications: boolean

  @Field(() => UserModel)
  user: UserModel

  @Field(() => String)
  userId: string
}

@ObjectType()
export class ChangeNotificationsSettingsResponse {
  @Field(() => NotificationSettingsModel)
  notificationSettings: NotificationSettingsModel

  @Field(() => String, { nullable: true })
  telegramAuthToken?: string
}
