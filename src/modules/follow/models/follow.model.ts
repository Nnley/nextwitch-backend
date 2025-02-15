import { Follow } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from '../../auth/account/models/user.model'

@ObjectType()
export class FollowModel extends BaseType implements Follow {
  @Field(() => UserModel)
  follower: UserModel

  @Field(() => String)
  followerId: string

  @Field(() => UserModel)
  following: UserModel

  @Field(() => String)
  followingId: string
}
