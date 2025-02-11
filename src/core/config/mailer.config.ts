import type { MailerOptions } from '@nestjs-modules/mailer'
import type { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
      host: configService.getOrThrow<string>('SMTP_HOST'),
      port: configService.getOrThrow<number>('SMTP_PORT'),
      secure: configService.getOrThrow<boolean>('SMTP_SECURE'),
      auth: {
        user: configService.getOrThrow<string>('SMTP_USER'),
        pass: configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    },
    defaults: {
      from: `${configService.getOrThrow<string>('SMTP_FROM_NAME')} <${configService.getOrThrow<string>('SMTP_USER')}>`,
    },
  }
}
