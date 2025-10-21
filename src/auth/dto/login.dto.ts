
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @Length(1, 50, { message: 'El nombre de usuario debe tener entre 1 y 50 caracteres.' })
  nombreDeUsuario: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Length(1, 50, { message: 'La contraseña debe tener entre 1 y 50 caracteres.' })
  contrasena: string;
}