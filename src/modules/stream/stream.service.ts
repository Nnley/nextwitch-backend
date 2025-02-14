import type { Prisma, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as Upload from 'graphql-upload/Upload.js'
import sharp from 'sharp'
import { StorageService } from '../libs/storage/storage.service'
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { StreamFiltersInput } from './inputs/filters.input'

@Injectable()
export class StreamService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService
  ) {}

  public async findAll(input: StreamFiltersInput) {
    const { take, skip, searchTerm } = input

    const whereClause = searchTerm ? this.findBySearchTermFilter(searchTerm) : undefined

    const streams = await this.prismaService.stream.findMany({
      take: take ?? 12,
      skip: skip ?? 0,
      where: {
        user: {
          isDeactivated: false,
        },
        ...whereClause,
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
      orderBy: {
        isLive: 'desc',
      },
    })

    return streams
  }

  public async findRandomStreams() {
    const total = await this.prismaService.stream.count({
      where: {
        user: {
          isDeactivated: false,
        },
      },
    })

    if (total === 0) {
      return []
    }

    const skip = total <= 4 ? 0 : Math.floor(Math.random() * total)

    const streams = await this.prismaService.stream.findMany({
      where: {
        user: {
          isDeactivated: false,
        },
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
      skip,
      take: Math.min(100, total),
    })

    return streams.sort(() => 0.5 - Math.random()).slice(0, 4)
  }

  public async changeInfo(user: User, input: ChangeStreamInfoInput) {
    const { title, categoryId } = input

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        title,
      },
    })

    return true
  }

  public async changeThumbnail(user: User, file: Upload) {
    const stream = await this.findByUserId(user)

    if (!stream) {
      throw new NotFoundException('Stream not found')
    }

    if (stream.thumbnailUrl) {
      await this.storageService.remove(stream.thumbnailUrl)
    }

    const chunks: Buffer[] = []

    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    const fileName = `/streams/${user.id}.webp`

    if (file.filename && file.filename.endWith('.gif')) {
      const processedBuffer = await sharp(buffer, { animated: true }).resize(1280, 720).webp().toBuffer()

      await this.storageService.upload(processedBuffer, fileName, 'image/webp')
    } else {
      const processedBuffer = await sharp(buffer).resize(1280, 720).webp().toBuffer()

      await this.storageService.upload(processedBuffer, fileName, 'image/webp')
    }

    await this.prismaService.stream.update({
      where: {
        id: user.id,
      },
      data: {
        thumbnailUrl: fileName,
      },
    })

    return true
  }

  public async removeThumbnail(user: User) {
    const stream = await this.findByUserId(user)

    if (!stream.thumbnailUrl) {
      return
    }

    await this.storageService.remove(stream.thumbnailUrl)

    await this.prismaService.stream.update({
      where: {
        id: user.id,
      },
      data: {
        thumbnailUrl: null,
      },
    })

    return true
  }

  private async findByUserId(user: User) {
    const stream = await this.prismaService.stream.findUnique({
      where: {
        userId: user.id,
      },
    })

    return stream
  }

  private findBySearchTermFilter(searchTerm: string): Prisma.StreamWhereInput {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    }
  }
}
