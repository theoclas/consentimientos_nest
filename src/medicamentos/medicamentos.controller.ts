import { Controller, Get, Query } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { Medicamento } from './entities/medicamento.entity';

@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  @Get('buscar')
  async search(
    @Query('descripcionObjeto') descripcionObjeto: string,
  ): Promise<Medicamento[]> {
    return this.medicamentosService.buscarbydescripcion(descripcionObjeto);
  }
}
