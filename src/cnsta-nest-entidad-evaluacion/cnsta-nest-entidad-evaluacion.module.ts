import { Module } from '@nestjs/common';
import { CnstaNestEntidadEvaluacionService } from './cnsta-nest-entidad-evaluacion.service';
import { CnstaNestEntidadEvaluacionController } from './cnsta-nest-entidad-evaluacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CnstaNestEntidadEvaluacion } from './entities/cnsta-nest-entidad-evaluacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CnstaNestEntidadEvaluacion])],
  controllers: [CnstaNestEntidadEvaluacionController],
  providers: [CnstaNestEntidadEvaluacionService],
})
export class CnstaNestEntidadEvaluacionModule {}
