import type { SocialLink } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SocialLinkModel extends BaseType implements SocialLink {
  @Field(() => String)
  title: string

  @Field(() => String)
  url: string

  @Field(() => String)
  userId: string

  @Field(() => Number)
  position: number
}
