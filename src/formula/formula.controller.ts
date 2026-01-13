// formula.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { FormulaService } from './formula.service';
import { CreateFormulaDto } from './dto/create-formula.dto';

@Controller('formulas')
export class FormulaController {
  constructor(private readonly service: FormulaService) {}

  @Post()
  async crear(@Body() dto: CreateFormulaDto) {
    return this.service.crearFormula(dto);
  }
}
