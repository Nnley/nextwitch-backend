import { Body, Controller, Headers, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common'
import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
  public constructor(private readonly webhookService: WebhookService) {}

  @Post('livekit')
  @HttpCode(HttpStatus.OK)
  public async receiveWebhookLivekit(@Body() body: string, @Headers('Authorization') authorization: string) {
    if (!authorization) {
      return new UnauthorizedException('Unauthorized')
    }

    await this.webhookService.receiveWebhookLivekit(body, authorization)
  }
}
