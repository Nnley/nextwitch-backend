import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/src/shared/types/gpl-context.types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { UpdatePasswordInput } from './inputs/update-password.input'
import { PasswordRecoveryService } from './password-recovery.service'

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
  public constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

  @Mutation(() => Boolean, { name: 'resetPassword' })
  public async resetPassword(
    @Context() { req }: GqlContext,
    @Args('data') input: ResetPasswordInput,
    @UserAgent() userAgent: string
  ) {
    return this.passwordRecoveryService.resetPassword(req, input, userAgent)
  }

  @Mutation(() => Boolean, { name: 'updatePassword' })
  public async updatePassword(@Args('data') input: UpdatePasswordInput) {
    return this.passwordRecoveryService.updatePassword(input)
  }
}
