// src/consentimientos/consentimientos.module.ts
import { Module } from '@nestjs/common';
import { ConsentimientosController } from './consentimientos.controller';
import { DocumentoAnexoModule } from '../documento-anexo/documento-anexo.module';

@Module({
  imports: [DocumentoAnexoModule],   // 👈 necesario para inyectar DocumentoAnexoService
  controllers: [ConsentimientosController],
})
export class ConsentimientosModule {}
