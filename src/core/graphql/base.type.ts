import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export class BaseType {
  @Field(() => String)
  id: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
