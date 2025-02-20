import { SponsorshipPlan } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PlanModel extends BaseType implements SponsorshipPlan {
  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  description: string

  @Field(() => Number)
  price: number

  @Field(() => UserModel)
  channel: UserModel

  @Field(() => String)
  channelId: string

  @Field(() => String)
  stripePlanId: string

  @Field(() => String)
  stripeProductId: string
}
