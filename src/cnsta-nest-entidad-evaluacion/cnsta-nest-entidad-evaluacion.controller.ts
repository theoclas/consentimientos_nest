import { Controller, Get, Query } from '@nestjs/common';
import { CnstaNestEntidadEvaluacionService } from './cnsta-nest-entidad-evaluacion.service';
import { CreateCnstaNestEntidadEvaluacionDto } from './dto/create-cnsta-nest-entidad-evaluacion.dto'; 

@Controller('cnsta-nest-entidad-evaluacion')
export class CnstaNestEntidadEvaluacionController {
  constructor(private readonly service: CnstaNestEntidadEvaluacionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  async findOne(@Query('DocumentoEntidad') DocumentoEntidad: string) {
    return this.service.findOne(DocumentoEntidad);
  }

  // @Get('search')
  // search(@Query() q: CreateCnstaNestEntidadEvaluacionDto) {
  //   return this.service.search(q);
  // }
}
