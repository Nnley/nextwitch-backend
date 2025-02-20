import { PrismaService } from '@/src/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SubscriptionService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findMySponsors(userId: string) {
    const sponsors = await this.prismaService.sponsorshipSubscription.findMany({
      where: {
        channelId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        plan: true,
        user: true,
        channel: true,
      },
    })

    return sponsors
  }
}
