import { Module } from '@nestjs/common';
import { DocumentoAnexoService } from './documento-anexo.service';
import { DocumentoAnexoController } from './documento-anexo.controller';
import { DocumentoAnexo } from './entities/documento-anexo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentoAnexo])],
  controllers: [DocumentoAnexoController],
  providers: [DocumentoAnexoService],
})
export class DocumentoAnexoModule {}
