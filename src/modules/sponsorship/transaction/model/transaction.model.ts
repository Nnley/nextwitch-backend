import { Transaction, TransactionStatus } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
})

@ObjectType()
export class TransactionModel extends BaseType implements Transaction {
  @Field(() => Number)
  amount: number

  @Field(() => String)
  currency: string

  @Field(() => TransactionStatus)
  status: TransactionStatus

  @Field(() => String)
  stripeSubscriptionId: string

  @Field(() => UserModel)
  user: UserModel

  @Field(() => String)
  userId: string
}
