import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  name!: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email!: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/, {
    message: 'Senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caracteres especiais',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password!: string;
}
