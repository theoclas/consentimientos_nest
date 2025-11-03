import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateDocumentoAnexoDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoEntidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  documentoAnexo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  descripcionDocumentoAnexo?: string;

  @IsOptional()
  @IsDateString()
  fechaDocumentoAnexo?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoEmpresa?: string;

  @IsOptional()
  @IsInt()
  idTerminal?: number;

  @IsOptional()
  @IsInt()
  idEstado?: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  rutaCarpeta?: string;


}
