import type { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/update-password.input'
import { ValidatorConstraint, type ValidationArguments, type ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatching implements ValidatorConstraintInterface {
  public validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as NewPasswordInput

    return object.password === confirmPassword
  }

  public defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match'
  }
}
