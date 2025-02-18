import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangeNotificationsSettingsInput {
  @Field(() => Boolean)
  siteNotifications: boolean

  @Field(() => Boolean)
  telegramNotifications: boolean
}
