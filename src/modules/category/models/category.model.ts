import { Category } from '@/prisma/generated'
import { BaseType } from '@/src/core/graphql/base.type'
import { Field, ObjectType } from '@nestjs/graphql'
import { StreamModel } from '../../stream/models/stream.model'

@ObjectType()
export class CategoryModel extends BaseType implements Category {
  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  thumbnailUrl: string

  @Field(() => [StreamModel])
  streams: StreamModel[]

  @Field(() => String)
  description: string

  @Field(() => String)
  slug: string
}
