import { type User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/src/shared/types/gpl-context.types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { AuthModel } from '../account/models/auth.model'
import { DeactivateService } from './deactivate.service'
import { DeactivateAccountInput } from './inputs/deactivate-account.input'

@Resolver('Deactivate')
export class DeactivateResolver {
  public constructor(private readonly deactivateService: DeactivateService) {}

  @Authorization()
  @Mutation(() => AuthModel, { name: 'deactivateAccount' })
  public async deactivate(
    @Context() { req }: GqlContext,
    @Authorized() user: User,
    @Args('data') input: DeactivateAccountInput,
    @UserAgent() userAgent: string
  ) {
    return await this.deactivateService.deactivate(req, input, user, userAgent)
  }
}
