import { SponsorshipSubscription } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SubscriptionModel extends BaseType implements SponsorshipSubscription {
  @Field(() => String)
  planId: string

  @Field(() => UserModel)
  channel: UserModel

  @Field(() => String)
  channelId: string

  @Field(() => Date)
  expiresAt: Date

  @Field(() => UserModel)
  user: UserModel

  @Field(() => String)
  userId: string
}
