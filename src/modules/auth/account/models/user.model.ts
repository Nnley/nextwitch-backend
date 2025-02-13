import type { User } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
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

  @Field(() => String, { nullable: true })
  totpSecret: string | null

  @Field(() => String, { nullable: true })
  avatarUrl: string | null

  @Field(() => String, { nullable: true })
  bio: string | null
}
