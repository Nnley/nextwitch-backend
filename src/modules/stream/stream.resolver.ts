import type { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as GraphqlUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { StreamFiltersInput } from './inputs/filters.input'
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input'
import { GenerateStreamTokenModel } from './models/generate-stream-token.mode'
import { StreamModel } from './models/stream.model'
import { StreamService } from './stream.service'

@Resolver('Stream')
export class StreamResolver {
  public constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: 'findAllStreams' })
  public async findAll(@Args('filters') input: StreamFiltersInput) {
    return this.streamService.findAll(input)
  }

  @Query(() => [StreamModel], { name: 'findRandomStreams' })
  public async findRandomStreams() {
    return this.streamService.findRandomStreams()
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeStreamInfo' })
  public async changeInfo(@Authorized() user: User, @Args('data') input: ChangeStreamInfoInput) {
    return this.streamService.changeInfo(user, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
  public async changeThumbnail(
    @Authorized() user: User,
    @Args('thumbnail', { type: () => GraphqlUpload }, FileValidationPipe) avatar: Upload
  ) {
    return this.streamService.changeThumbnail(user, avatar)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
  public async removeThumbnail(@Authorized() user: User) {
    return this.streamService.removeThumbnail(user)
  }

  @Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
  public async generateToken(@Args('data') input: GenerateStreamTokenInput) {
    return this.streamService.generateToken(input)
  }
}
