import { Controller, Get, Param } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';

@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  @Get()
  findAll() {
    return this.profesionalesService.findAll();
  }

  @Get(':documentoProfesional')
  findOne(@Param('documentoProfesional') documentoProfesional: string) {
    return this.profesionalesService.findOne(documentoProfesional);
  }


}
