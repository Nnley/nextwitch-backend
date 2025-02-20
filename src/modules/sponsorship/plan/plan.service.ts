import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { StripeService } from '../../libs/stripe/stripe.service'
import { CreatePlanInput } from './inputs/create-plan.input'

@Injectable()
export class PlanService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService
  ) {}

  public async findMyPlans(userId: string) {
    const plans = await this.prismaService.sponsorshipPlan.findMany({
      where: {
        channelId: userId,
      },
    })

    return plans
  }

  public async create(userId: string, input: CreatePlanInput) {
    const { title, description, price } = input

    const channel = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!channel.isVerified) {
      throw new ForbiddenException('You need to be verified to create a plan')
    }

    const stripePlan = await this.stripeService.plans.create({
      amount: Math.round(price * 100),
      currency: 'eur',
      interval: 'month',
      product: {
        name: title,
      },
    })

    await this.prismaService.sponsorshipPlan.create({
      data: {
        title,
        description,
        price,
        stripeProductId: stripePlan.product.toString(),
        stripePlanId: stripePlan.id,
        channel: {
          connect: {
            id: userId,
          },
        },
      },
    })

    return true
  }

  public async delete(planId: string) {
    const plan = await this.prismaService.sponsorshipPlan.findUnique({
      where: {
        id: planId,
      },
    })

    if (!plan) {
      throw new NotFoundException('Plan not found')
    }

    await this.stripeService.plans.del(plan.stripePlanId)
    await this.stripeService.products.del(plan.stripeProductId)

    await this.prismaService.sponsorshipPlan.delete({
      where: {
        id: planId,
      },
    })

    return true
  }
}
