import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

@InputType()
export class SendMessageInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  text: string

  @Field(() => String)
  @IsString()
  @IsUUID('4')
  @IsNotEmpty()
  streamId: string
}
