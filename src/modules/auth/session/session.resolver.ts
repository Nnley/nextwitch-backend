import type { GqlContext } from '@/src/shared/types/gpl-context.types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { UserModel } from '../account/models/user.model'
import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => UserModel, { name: 'login' })
  public async login(@Context() { req }: GqlContext, @Args('data') input: LoginInput) {
    return await this.sessionService.login(req, input)
  }

  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Context() { req }: GqlContext) {
    return await this.sessionService.logout(req)
  }
}
