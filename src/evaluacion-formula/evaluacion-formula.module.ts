import { Module } from '@nestjs/common';
import { EvaluacionFormulaService } from './evaluacion-formula.service';
import { EvaluacionFormulaController } from './evaluacion-formula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionFormula } from './entities/evaluacion-formula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluacionFormula])],
  controllers: [EvaluacionFormulaController],
  providers: [EvaluacionFormulaService],
})
export class EvaluacionFormulaModule {}
