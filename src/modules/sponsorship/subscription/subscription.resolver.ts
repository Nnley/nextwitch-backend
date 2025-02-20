import { Resolver } from '@nestjs/graphql'
import { SubscriptionService } from './subscription.service'

@Resolver('Subscription')
export class SubscriptionResolver {
  public constructor(private readonly subscriptionService: SubscriptionService) {}
}
