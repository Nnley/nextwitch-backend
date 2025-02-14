import { PrismaService } from '@/src/core/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class CategoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAll() {
    return await this.prismaService.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  public async findRandomCategories() {
    const total = await this.prismaService.category.count()

    if (total === 0) {
      return []
    }

    const skip = total <= 7 ? 0 : Math.floor(Math.random() * total)

    const categories = await this.prismaService.category.findMany({
      skip,
      take: Math.min(100, total),
    })

    return categories.sort(() => 0.5 - Math.random()).slice(0, 7)
  }

  public async findBySlug(slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        slug,
      },
      include: {
        streams: {
          select: {
            title: true,
            isLive: true,
            thumbnailUrl: true,
          },
          include: {
            user: {
              select: {
                username: true,
                avatarUrl: true,
                displayName: true,
              },
            },
            category: true,
          },
        },
      },
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return category
  }
}
