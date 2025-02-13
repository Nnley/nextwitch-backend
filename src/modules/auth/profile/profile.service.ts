import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ConflictException, Injectable } from '@nestjs/common'
import * as Upload from 'graphql-upload/Upload.js'
import sharp from 'sharp'
import { StorageService } from '../../libs/storage/storage.service'
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'

@Injectable()
export class ProfileService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService
  ) {}

  public async changeAvatar(user: User, file: Upload) {
    if (user.avatarUrl) {
      await this.storageService.remove(user.avatarUrl)
    }

    const chunks: Buffer[] = []

    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    const fileName = `/channels/${user.id}.webp`

    if (file.filename && file.filename.endWith('.gif')) {
      const processedBuffer = await sharp(buffer, { animated: true }).resize(512, 512).webp().toBuffer()

      await this.storageService.upload(processedBuffer, fileName, 'image/webp')
    } else {
      const processedBuffer = await sharp(buffer).resize(512, 512).webp().toBuffer()

      await this.storageService.upload(processedBuffer, fileName, 'image/webp')
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatarUrl: fileName,
      },
    })

    return true
  }

  public async removeAvatar(user: User) {
    if (!user.avatarUrl) {
      return
    }

    await this.storageService.remove(user.avatarUrl)

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatarUrl: null,
      },
    })

    return true
  }

  public async changeInfo(user: User, input: ChangeProfileInfoInput) {
    const { username, displayName, bio } = input

    const usernameExists = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    })

    if (usernameExists || username === user.username) {
      throw new ConflictException('Username already exists')
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        displayName,
        bio,
      },
    })

    return true
  }
}
