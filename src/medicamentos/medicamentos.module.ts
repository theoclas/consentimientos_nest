import { Module } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { MedicamentosController } from './medicamentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicamento } from './entities/medicamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medicamento])],
  controllers: [MedicamentosController],
  providers: [MedicamentosService],
})
export class MedicamentosModule { }
