import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
// import { CreateEmpresaDto } from './dto/create-empresa.dto';
// import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

 

  @Get()
  findAll() {
    return this.empresasService.findAll();
  }

  @Get(':id')
  findOne(@Param('documentoEmpresa') documentoEmpresa: string) {
    return this.empresasService.findOne(documentoEmpresa);
  }

}
