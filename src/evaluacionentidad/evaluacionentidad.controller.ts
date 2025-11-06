import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvaluacionentidadService } from './evaluacionentidad.service';
import { CreateEvaluacionentidadDto } from './dto/create-evaluacionentidad.dto';
import { UpdateEvaluacionentidadDto } from './dto/update-evaluacionentidad.dto';

@Controller('evaluacionentidad')
export class EvaluacionentidadController {
  constructor(private readonly evaluacionentidadService: EvaluacionentidadService) {}

  @Post()
  create(@Body() createEvaluacionentidadDto: CreateEvaluacionentidadDto) {
    return this.evaluacionentidadService.create(createEvaluacionentidadDto);
  }

  @Get()
  findAll() {
    return this.evaluacionentidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluacionentidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvaluacionentidadDto: UpdateEvaluacionentidadDto) {
    return this.evaluacionentidadService.update(+id, updateEvaluacionentidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluacionentidadService.remove(+id);
  }
}
