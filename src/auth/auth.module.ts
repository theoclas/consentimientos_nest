import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ContraseñasModule } from 'src/contraseñas/contraseñas.module';

@Module({
  imports: [ContraseñasModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
