import type { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StripeService } from '../../libs/stripe/stripe.service'

@Injectable()
export class TransactionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService
  ) {}

  public async findMyTransactions(userId: string) {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId: userId,
      },
    })

    return transactions
  }

  public async makePayment(user: User, planId: string) {
    const plan = await this.prismaService.sponsorshipPlan.findUnique({
      where: {
        id: planId,
      },
      include: {
        channel: true,
      },
    })

    if (!plan) {
      throw new NotFoundException('Plan not found')
    }

    if (user.id === plan.channel.id) {
      throw new ConflictException('You cannot sponsor yourself')
    }

    const existingSubscription = await this.prismaService.sponsorshipSubscription.findFirst({
      where: {
        userId: user.id,
        channelId: plan.channel.id,
      },
    })

    if (existingSubscription) {
      throw new ConflictException('You already have a subscription')
    }

    const customer = await this.stripeService.customers.create({
      name: user.username,
      email: user.email,
    })

    const successUrl = `${this.configService.get<string>('ALLOWED_ORIGIN')}/success?price=${encodeURIComponent(plan.price.toString())}&channel=${encodeURIComponent(plan.channel.username)}`

    const cancelUrl = `${this.configService.get<string>('ALLOWED_ORIGIN')}/cancel`

    const session = await this.stripeService.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: plan.title,
            },
            unit_amount: Math.round(plan.price * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customer.id,
      metadata: {
        planId: plan.id,
        userId: user.id,
        channelId: plan.channel.id,
      },
    })

    await this.prismaService.transaction.create({
      data: {
        amount: plan.price,
        currency: session.currency,
        stripeSubscriptionId: session.id,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    return { url: session.url }
  }
}
