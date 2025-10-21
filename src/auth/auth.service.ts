import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ContraseñasService } from 'src/contraseñas/contraseñas.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly contrasenasService: ContraseñasService,
  ) { }

  async login({ nombreDeUsuario, contrasena }: LoginDto): Promise<boolean> {
    const contraseña = await this.contrasenasService.findbynombreDeUsuariowithcontraseña(nombreDeUsuario);
    if (!contraseña) {
      throw new UnauthorizedException('Usuario mal ingresado');
    }
    if (contraseña.contrasena !== contrasena) {
      throw new UnauthorizedException('Contraseña mal ingresada');
    }
    return true;

  }
}
