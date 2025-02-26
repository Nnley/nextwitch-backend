import { Stream } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from '../../auth/account/models/user.model'
import { CategoryModel } from '../../category/models/category.model'
import { ChatMessageModel } from '../../chat/models/chat-message.model'

@ObjectType()
export class StreamModel extends BaseType implements Stream {
  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  thumbnailUrl: string

  @Field(() => String, { nullable: true })
  ingressId: string

  @Field(() => String, { nullable: true })
  serverUrl: string

  @Field(() => String, { nullable: true })
  streamKey: string

  @Field(() => Boolean)
  isChatEnabled: boolean

  @Field(() => Boolean)
  isChatFollowersOnly: boolean

  @Field(() => Boolean)
  isChatPremiumFollowersOnly: boolean

  @Field(() => Boolean)
  isLive: boolean

  @Field(() => UserModel)
  user: UserModel

  @Field(() => String)
  userId: string

  @Field(() => CategoryModel)
  category: CategoryModel

  @Field(() => String)
  categoryId: string

  @Field(() => [ChatMessageModel])
  chatMessages: ChatMessageModel[]
}
