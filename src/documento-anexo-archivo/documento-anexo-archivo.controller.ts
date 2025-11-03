import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentoAnexoArchivoService } from './documento-anexo-archivo.service';
import { CreateDocumentoAnexoArchivoDto } from './dto/create-documento-anexo-archivo.dto';
import { UpdateDocumentoAnexoArchivoDto } from './dto/update-documento-anexo-archivo.dto';

@Controller('documento-anexo-archivo')
export class DocumentoAnexoArchivoController {
  constructor(private readonly documentoAnexoArchivoService: DocumentoAnexoArchivoService) {}

  @Post()
  create(@Body() createDocumentoAnexoArchivoDto: CreateDocumentoAnexoArchivoDto) {
    return this.documentoAnexoArchivoService.create(createDocumentoAnexoArchivoDto);
  }

  @Get()
  findAll() {
    return this.documentoAnexoArchivoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentoAnexoArchivoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentoAnexoArchivoDto: UpdateDocumentoAnexoArchivoDto) {
    return this.documentoAnexoArchivoService.update(+id, updateDocumentoAnexoArchivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentoAnexoArchivoService.remove(+id);
  }
}
