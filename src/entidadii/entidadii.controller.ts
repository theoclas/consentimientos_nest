import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntidadiiService } from './entidadii.service';
import { CreateEntidadIIDto } from './dto/create-entidadii.dto';
import { UpdateEntidadIIDto } from './dto/update-entidadii.dto';

@Controller('entidadii')
export class EntidadiiController {
  constructor(private readonly entidadiiService: EntidadiiService) {}

  @Post()
  create(@Body() createEntidadiiDto: CreateEntidadIIDto) {
    return this.entidadiiService.create(createEntidadiiDto);
  }

  @Get()
  findAll() {
    return this.entidadiiService.findAll();
  }

  @Get(':Documento')
  findOne(@Param('Documento') Documento: string) {
    return this.entidadiiService.findOne(Documento);
  }

  @Patch(':Documento')
  update(@Param('Documento') Documento: string, @Body() updateEntidadiiDto: UpdateEntidadIIDto) {
    return this.entidadiiService.update(Documento, updateEntidadiiDto);
  }

  @Delete(':Documento')
  remove(@Param('Documento') Documento: string) {
    return this.entidadiiService.remove(Documento);
  }
}
