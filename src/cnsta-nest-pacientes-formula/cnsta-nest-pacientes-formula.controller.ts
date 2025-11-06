import { Controller, Get, Param } from '@nestjs/common';
import { CnstaNestPacientesFormulaService } from './cnsta-nest-pacientes-formula.service';

@Controller('cnsta-nest-pacientes-formula')
export class CnstaNestPacientesFormulaController {
  constructor(private readonly cnstaNestPacientesFormulaService: CnstaNestPacientesFormulaService) { }

  @Get()
  findAll() {
    return this.cnstaNestPacientesFormulaService.findAll();
  }

  @Get(':documentoEntidad')
  findOne(@Param('documentoEntidad') documentoEntidad: string) {
    return this.cnstaNestPacientesFormulaService.findOne(documentoEntidad);
  }


}
