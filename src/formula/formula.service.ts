import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class FormulaService {
  constructor(private readonly dataSource: DataSource) { }

  async crearFormula(dto: {
    contenido: string;
    documentoEmpresa: string;
    documentoPaciente: string;
  }) {
    await this.dataSource.query(
      `
    EXEC [dbo].[PA Nest Insertar Formula Medica]
      @Contenido = @0,
      @DocumentoEmpresa = @1,
      @DocumentoPaciente = @2
    `,
      [
        dto.contenido,
        dto.documentoEmpresa,
        dto.documentoPaciente
      ],
    );

    return { ok: true };
  }

}
