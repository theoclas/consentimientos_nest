import { Module } from '@nestjs/common';
import { EvaluacionentidadService } from './evaluacionentidad.service';
import { EvaluacionentidadController } from './evaluacionentidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluacionentidad } from './entities/evaluacionentidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluacionentidad])],
  controllers: [EvaluacionentidadController],
  providers: [EvaluacionentidadService],
})
export class EvaluacionentidadModule {}
