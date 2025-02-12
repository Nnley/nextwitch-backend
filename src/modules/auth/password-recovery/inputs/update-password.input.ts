import { IsPasswordMatching } from '@/src/shared/decorators/is-password-matching'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID, MinLength, Validate } from 'class-validator'

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Validate(IsPasswordMatching)
  confirmPassword: string

  @Field(() => String)
  @IsUUID('4')
  @IsNotEmpty()
  token: string
}
