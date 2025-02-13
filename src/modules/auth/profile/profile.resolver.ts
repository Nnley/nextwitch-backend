import type { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import * as GraphqlUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import { ProfileService } from './profile.service'

@Resolver('Profile')
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeProfileAvatar' })
  public async changeAvatar(@Authorized() user: User, @Args('avatar', { type: () => GraphqlUpload }) avatar: Upload) {
    return this.profileService.changeAvatar(user, avatar)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeProfileAvatar' })
  public async removeAvatar(@Authorized() user: User) {
    return this.profileService.removeAvatar(user)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeProfileInfo' })
  public async changeProfileInfo(@Authorized() user: User, @Args('data') input: ChangeProfileInfoInput) {
    return this.profileService.changeInfo(user, input)
  }
}
