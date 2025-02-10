import { applyDecorators, UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../guards/gpl-auth.guard'

export function Authorization() {
  return applyDecorators(UseGuards(GqlAuthGuard))
}
