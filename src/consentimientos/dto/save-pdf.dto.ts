import { IsOptional, IsString } from 'class-validator';

export class SavePdfDto {
  @IsString()
  html!: string;

  @IsOptional()
  @IsString()
  pacienteNombre?: string;

  @IsOptional()
  @IsString()
  pacienteDoc?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  documentoEmpresa?: string;
}
