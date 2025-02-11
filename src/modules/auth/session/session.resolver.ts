import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import type { GqlContext } from '@/src/shared/types/gpl-context.types'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserModel } from '../account/models/user.model'
import { LoginInput } from './inputs/login.input'
import { SessionModel } from './models/session.model'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

  @Authorization()
  @Query(() => [SessionModel], { name: 'findSessionsByUser' })
  public async findByUser(@Context() { req }: GqlContext) {
    return await this.sessionService.findByUser(req)
  }

  @Authorization()
  @Query(() => SessionModel, { name: 'findCurrentSession' })
  public async findCurrent(@Context() { req }: GqlContext) {
    return await this.sessionService.findCurrent(req)
  }

  @Mutation(() => UserModel, { name: 'login' })
  public async login(@Context() { req }: GqlContext, @Args('data') input: LoginInput, @UserAgent() userAgent: string) {
    return await this.sessionService.login(req, input, userAgent)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Context() { req }: GqlContext) {
    return await this.sessionService.logout(req)
  }

  @Mutation(() => Boolean, { name: 'clearSessionCookie' })
  public async clearSession(@Context() { req }: GqlContext) {
    return await this.sessionService.clearSession(req)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  public async remove(@Context() { req }: GqlContext, @Args('id') id: string) {
    return await this.sessionService.remove(req, id)
  }
}
