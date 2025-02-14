import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class StreamFiltersInput {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  take?: number

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  skip?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  searchTerm?: string
}
