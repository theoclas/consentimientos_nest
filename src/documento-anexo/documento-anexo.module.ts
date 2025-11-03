import { Module } from '@nestjs/common';
import { DocumentoAnexoService } from './documento-anexo.service';
import { DocumentoAnexoController } from './documento-anexo.controller';
import { DocumentoAnexo } from './entities/documento-anexo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DocumentoAnexoArchivo } from './entities/documento-anexo-archivo.entity';
import { DocumentoAnexoArchivo } from '../documento-anexo-archivo/entities/documento-anexo-archivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentoAnexo, DocumentoAnexoArchivo])],
  controllers: [DocumentoAnexoController],

  providers: [DocumentoAnexoService],
  exports: [DocumentoAnexoService],
})
export class DocumentoAnexoModule { }
