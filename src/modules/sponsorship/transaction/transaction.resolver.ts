import type { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { MakePaymentModel } from './model/make-payment.model'
import { TransactionModel } from './model/transaction.model'
import { TransactionService } from './transaction.service'

@Resolver('Transaction')
export class TransactionResolver {
  public constructor(private readonly transactionService: TransactionService) {}

  @Authorization()
  @Query(() => [TransactionModel], { name: 'findMyTransactions' })
  public async findMyTransactions(@Authorized('id') userId: string) {
    return this.transactionService.findMyTransactions(userId)
  }

  @Authorization()
  @Mutation(() => MakePaymentModel, { name: 'makePayment' })
  public async makePayment(@Authorized() user: User, @Args('planId') planId: string) {
    return this.transactionService.makePayment(user, planId)
  }
}
