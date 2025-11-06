
import { IsOptional, IsString, IsInt, IsDateString, IsBoolean, MaxLength } from 'class-validator';

export class CreateEvaluacionentidadDto {
  @IsOptional()
  @IsInt()
  idTipoEvaluacion?: number;

  @IsOptional()
  @IsDateString()
  fechaEvaluacionEntidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoEntidad?: string;

  @IsOptional()
  @IsInt()
  edadEntidadEvaluacion?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  acompananteEvaluacion?: string;

  @IsOptional()
  @IsInt()
  idParentesco?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefonoAcompanante?: string;

  @IsOptional()
  @IsString()
  diagnosticoGeneral?: string;

  @IsOptional()
  @IsString()
  diagnosticoEspecifico?: string;

  @IsOptional()
  @IsBoolean()
  manejoMedicamentos?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  direccionDomicilio?: string;

  @IsOptional()
  @IsInt()
  idCiudad?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
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
  idEstado?: number;

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
  @MaxLength(250)
  responsableEvaluacion?: string;

  @IsOptional()
  @IsInt()
  idParentescoResponsable?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefonoResponsable?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoUsuario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoEmpresa?: string;

  @IsOptional()
  @IsInt()
  idTerminal?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentoProfesional?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  firmaEvaluacion?: string;
}

