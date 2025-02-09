import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

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
}
