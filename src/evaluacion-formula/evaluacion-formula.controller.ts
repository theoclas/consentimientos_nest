import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EvaluacionFormulaService } from './evaluacion-formula.service';
import { CreateEvaluacionFormulaDto } from './dto/create-evaluacion-formula.dto';
import { UpdateEvaluacionFormulaDto } from './dto/update-evaluacion-formula.dto';

@Controller('evaluacion-formula')
export class EvaluacionFormulaController {
  constructor(private readonly service: EvaluacionFormulaService) { }

  @Post()
  create(@Body() dto: CreateEvaluacionFormulaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEvaluacionFormulaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
