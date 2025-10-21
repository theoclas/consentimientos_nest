import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntidadService } from './entidad.service';
import { CreateEntidadDto } from './dto/create-entidad.dto';
import { UpdateEntidadDto } from './dto/update-entidad.dto';

@Controller('entidad')
export class EntidadController {
  constructor(private readonly entidadService: EntidadService) {}

  @Post()
  create(@Body() createEntidadDto: CreateEntidadDto) {
    return this.entidadService.create(createEntidadDto);
  }

  @Get()
  findAll() {
    return this.entidadService.findAll();
  }

  @Get(':Documento')
  findOne(@Param('Documento') id: string) {
    return this.entidadService.findOne(id);
  }

  @Patch(':Documento')
  update(@Param('Documento') Documento: string, @Body() updateEntidadDto: UpdateEntidadDto) {
    return this.entidadService.update(Documento, updateEntidadDto);
  }

  @Delete(':Documento')
  remove(@Param('Documento') Documento: string) {
    return this.entidadService.remove(Documento);
  }
}
