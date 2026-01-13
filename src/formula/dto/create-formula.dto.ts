// create-formula.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateFormulaDto {
  @IsString()
  contenido: string;

  @IsString()
  documentoEmpresa: string;

  @IsString()
  documentoPaciente: string;

}
