import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ChangeChatSettingsInput } from './inputs/change-chat-setting.input'
import { SendMessageInput } from './inputs/send-message.input'

@Injectable()
export class ChatService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findMessagesByStreamId(streamId: string) {
    return await this.prismaService.chatMessage.findMany({
      where: {
        streamId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })
  }

  public async sendMessage(userId: string, input: SendMessageInput) {
    const { text, streamId } = input

    const stream = await this.prismaService.stream.findUnique({
      where: {
        id: streamId,
      },
    })

    if (!stream) {
      throw new NotFoundException('Stream not found')
    }

    if (!stream.isLive) {
      throw new BadRequestException('Stream is not live')
    }

    const message = await this.prismaService.chatMessage.create({
      data: {
        text,
        user: {
          connect: {
            id: userId,
          },
        },
        stream: {
          connect: {
            id: streamId,
          },
        },
      },
    })

    return message
  }

  public async changeSettings(user: User, input: ChangeChatSettingsInput) {
    const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } = input

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        isChatEnabled,
        isChatFollowersOnly,
        isChatPremiumFollowersOnly,
      },
    })

    return true
  }
}
