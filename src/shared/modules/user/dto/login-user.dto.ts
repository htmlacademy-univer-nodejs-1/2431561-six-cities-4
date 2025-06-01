import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { LoginUserMessages } from './login-user.messages.js';

export class LoginUserDto {
  @IsNotEmpty({ message: LoginUserMessages.email.invalidFormat })
  @IsEmail({}, { message: LoginUserMessages.email.invalidFormat })
  public email: string;

  @IsNotEmpty({ message: LoginUserMessages.password.invalidFormat })
  @IsString({ message: LoginUserMessages.password.invalidFormat })
  public password: string;
}
