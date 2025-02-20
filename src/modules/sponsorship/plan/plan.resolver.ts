import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreatePlanInput } from './inputs/create-plan.input'
import { PlanModel } from './models/plan.model'
import { PlanService } from './plan.service'

@Resolver('Plan')
export class PlanResolver {
  public constructor(private readonly planService: PlanService) {}

  @Authorization()
  @Query(() => [PlanModel], { name: 'findMySponsorshipPlans' })
  public async findMyPlans(@Authorized('id') userId: string) {
    return this.planService.findMyPlans(userId)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'createSponsorshipPlan' })
  public async createPlan(@Authorized('id') userId: string, @Args('data') input: CreatePlanInput) {
    return this.planService.create(userId, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'deleteSponsorshipPlan' })
  public async deletePlan(@Args('planId') planId: string) {
    return this.planService.delete(planId)
  }
}
