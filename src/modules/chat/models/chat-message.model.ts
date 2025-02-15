import { ChatMessage } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from '../../auth/account/models/user.model'
import { StreamModel } from '../../stream/models/stream.model'

@ObjectType()
export class ChatMessageModel extends BaseType implements ChatMessage {
  @Field(() => String)
  text: string

  @Field(() => UserModel)
  user: UserModel

  @Field(() => String)
  userId: string

  @Field(() => StreamModel)
  stream: StreamModel

  @Field(() => String)
  streamId: string
}
