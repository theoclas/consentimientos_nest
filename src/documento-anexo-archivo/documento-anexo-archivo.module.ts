import { Module } from '@nestjs/common';
import { DocumentoAnexoArchivoService } from './documento-anexo-archivo.service';
import { DocumentoAnexoArchivoController } from './documento-anexo-archivo.controller';

@Module({
  controllers: [DocumentoAnexoArchivoController],
  providers: [DocumentoAnexoArchivoService],
  exports: [DocumentoAnexoArchivoService],
})
export class DocumentoAnexoArchivoModule {}
