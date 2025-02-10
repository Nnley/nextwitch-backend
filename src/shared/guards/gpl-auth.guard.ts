import { PrismaService } from '@/src/core/prisma/prisma.service'
import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  public constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req

    if (typeof req.session.userId === 'undefined') {
      throw new UnauthorizedException('Unauthorized')
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: req.session.userId,
      },
    })

    req.user = user

    return true
  }
}
