import { Injectable } from '@nestjs/common';
import { CreateDocumentoAnexoArchivoDto } from './dto/create-documento-anexo-archivo.dto';
import { UpdateDocumentoAnexoArchivoDto } from './dto/update-documento-anexo-archivo.dto';

@Injectable()
export class DocumentoAnexoArchivoService {
  create(createDocumentoAnexoArchivoDto: CreateDocumentoAnexoArchivoDto) {
    return 'This action adds a new documentoAnexoArchivo';
  }

  findAll() {
    return `This action returns all documentoAnexoArchivo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentoAnexoArchivo`;
  }

  update(id: number, updateDocumentoAnexoArchivoDto: UpdateDocumentoAnexoArchivoDto) {
    return `This action updates a #${id} documentoAnexoArchivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentoAnexoArchivo`;
  }
}
