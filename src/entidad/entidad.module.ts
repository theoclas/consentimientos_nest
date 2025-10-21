import { Module } from '@nestjs/common';
import { EntidadService } from './entidad.service';
import { EntidadController } from './entidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entidad } from './entities/entidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entidad])],
  controllers: [EntidadController],
  providers: [EntidadService],
})
export class EntidadModule {}
