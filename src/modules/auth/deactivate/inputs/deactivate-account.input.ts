import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator'

@InputType()
export class DeactivateAccountInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

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
