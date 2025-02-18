import { type Notification, NotificationType } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { UserModel } from '../../auth/account/models/user.model'

registerEnumType(NotificationType, {
  name: 'NotificationType',
})

@ObjectType()
export class NotificationModel extends BaseType implements Notification {
  @Field(() => String)
  message: string

  @Field(() => NotificationType)
  type: NotificationType

  @Field(() => Boolean)
  isRead: boolean

  @Field(() => UserModel)
  user: UserModel

  @Field(() => String)
  userId: string
}
