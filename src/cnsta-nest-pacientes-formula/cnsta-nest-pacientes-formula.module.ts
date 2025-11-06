import { Module } from '@nestjs/common';
import { CnstaNestPacientesFormulaService } from './cnsta-nest-pacientes-formula.service';
import { CnstaNestPacientesFormulaController } from './cnsta-nest-pacientes-formula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CnstaNestPacientesFormula } from './entities/cnsta-nest-pacientes-formula.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CnstaNestPacientesFormula])],
  controllers: [CnstaNestPacientesFormulaController],
  providers: [CnstaNestPacientesFormulaService],
})
export class CnstaNestPacientesFormulaModule {}
