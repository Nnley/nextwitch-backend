import { BaseType } from '@/src/core/graphql/base.type'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel extends BaseType {
  @Field(() => String)
  email: string

  @Field(() => String)
  password: string

  @Field(() => String)
  username: string

  @Field(() => String)
  displayName: string

  @Field(() => String, { nullable: true })
  avatarUrl: string | null

  @Field(() => String, { nullable: true })
  bio: string | null
}
