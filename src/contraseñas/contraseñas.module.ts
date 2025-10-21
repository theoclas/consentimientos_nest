import { Module } from '@nestjs/common';
import { ContraseñasService } from './contraseñas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contraseña } from './entities/contraseña.entity';
import { ContraseñasController } from './contraseñas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contraseña])],
  controllers: [ContraseñasController],
  providers: [ContraseñasService],
  exports: [ContraseñasService],
})
export class ContraseñasModule { }
