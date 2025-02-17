import type { User } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { FollowModel } from '@/src/modules/follow/models/follow.model'
import { NotificationSettingsModel } from '@/src/modules/notification/models/notification-settings.model'
import { StreamModel } from '@/src/modules/stream/models/stream.model'
import { Field, ObjectType } from '@nestjs/graphql'
import { SocialLinkModel } from '../../profile/models/social-link.model'

@ObjectType()
export class UserModel extends BaseType implements User {
  @Field(() => String)
  email: string

  @Field(() => String)
  password: string

  @Field(() => String)
  username: string

  @Field(() => String)
  displayName: string

  @Field(() => Boolean)
  isVerified: boolean

  @Field(() => Boolean)
  isEmailVerified: boolean

  @Field(() => Boolean)
  isTotpEnabled: boolean

  @Field(() => Boolean)
  isDeactivated: boolean

  @Field(() => Date, { nullable: true })
  deactivatedAt: Date | null

  @Field(() => [SocialLinkModel])
  socialLinks: SocialLinkModel[]

  @Field(() => [FollowModel])
  followers: FollowModel[]

  @Field(() => [FollowModel])
  followings: FollowModel[]

  @Field(() => StreamModel)
  stream: StreamModel

  @Field(() => [NotificationSettingsModel])
  notifications: NotificationSettingsModel[]

  @Field(() => NotificationSettingsModel)
  notificationSettings: NotificationSettingsModel

  @Field(() => String, { nullable: true })
  totpSecret: string

  @Field(() => String, { nullable: true })
  avatarUrl: string

  @Field(() => String, { nullable: true })
  bio: string

  @Field(() => String, { nullable: true })
  telegramId: string
}
