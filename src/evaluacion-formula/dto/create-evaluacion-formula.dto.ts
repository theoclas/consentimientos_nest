
import { IsDateString, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEvaluacionFormulaDto {
  @IsOptional()
  @IsDateString()
  fechaEvaluacionEntidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoEntidad?: string;

  @IsOptional()
  @IsInt()
  edadEntidadEvaluacionEntidad?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  diagnosticoGeneralEvaluacionEntidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  diagnosticoEspecificoEvaluacionEntidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  direccionDomicilio?: string;

  @IsOptional()
  @IsInt()
  idCiudad?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefonoDomicilio?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsInt()
  idUnidadMedidaEdad?: number;

  @IsOptional()
  @IsInt()
  idSexo?: number;

  @IsOptional()
  @IsInt()
  idEstadoCivil?: number;

  @IsOptional()
  @IsInt()
  idOcupacion?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoAseguradora?: string;

  @IsOptional()
  @IsInt()
  idTipoAfiliado?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoUsuario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoEmpresa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoProfesional?: string;
}

