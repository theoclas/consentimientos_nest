import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocumentoAnexoService } from './documento-anexo.service';
import { CreateDocumentoAnexoDto } from './dto/create-documento-anexo.dto';
import { UpdateDocumentoAnexoDto } from './dto/update-documento-anexo.dto';

@Controller('documento-anexo')
export class DocumentoAnexoController {
  constructor(private readonly documentoAnexoService: DocumentoAnexoService) {}

  @Post()
  create(@Body() createDocumentoAnexoDto: CreateDocumentoAnexoDto) {
    return this.documentoAnexoService.create(createDocumentoAnexoDto);
  }

  @Get()
  findAll() {
    return this.documentoAnexoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') idDocumentoAnexo: number) {
    return this.documentoAnexoService.findOne(+idDocumentoAnexo);
  }

  @Patch(':id')
  update(
    @Param('id') idDocumentoAnexo: number,
    @Body() updateDocumentoAnexoDto: UpdateDocumentoAnexoDto,
  ) {
    return this.documentoAnexoService.update(
      +idDocumentoAnexo,
      updateDocumentoAnexoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') idDocumentoAnexo: number) {
    return this.documentoAnexoService.remove(+idDocumentoAnexo);
  }
}
