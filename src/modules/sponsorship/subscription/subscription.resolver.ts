import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Query, Resolver } from '@nestjs/graphql'
import { SubscriptionModel } from './models/subscription.model'
import { SubscriptionService } from './subscription.service'

@Resolver('Subscription')
export class SubscriptionResolver {
  public constructor(private readonly subscriptionService: SubscriptionService) {}

  @Authorization()
  @Query(() => [SubscriptionModel], { name: 'findMySponsors' })
  public async findMySponsors(@Authorized('id') userId: string) {
    return this.subscriptionService.findMySponsors(userId)
  }
}
