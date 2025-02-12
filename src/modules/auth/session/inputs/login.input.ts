import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator'

@InputType()
export class LoginInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  login: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Length(6, 6)
  pin?: string
}
