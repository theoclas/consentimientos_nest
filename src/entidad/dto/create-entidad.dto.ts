import { IsString, IsInt, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateEntidadDto {
  @IsString()
  documentoEntidad: string;

  @IsInt()
  idTipoDocumento: number;

  @IsOptional()
  @IsDateString()
  fechaExpedicionEntidad?: Date;

  @IsOptional()
  @IsInt()
  idCiudad?: number;

  @IsOptional()
  @IsString()
  primerApellidoEntidad?: string;

  @IsOptional()
  @IsString()
  segundoApellidoEntidad?: string;

  @IsOptional()
  @IsString()
  primerNombreEntidad?: string;

  @IsOptional()
  @IsString()
  segundoNombreEntidad?: string;

  @IsOptional()
  @IsDateString()
  fechaInscripcionEntidad?: Date;

  @IsOptional()
  @IsDateString()
  fechaExpiracionEntidad?: Date;

  @IsOptional()
  @IsString()
  codigoEntidad?: string;

  @IsOptional()
  @IsString()
  observacionesEntidad?: string;

  @IsOptional()
  @IsString()
  fotoEntidad?: string;

  @IsOptional()
  @IsString()
  noContratoEntidad?: string;

  @IsOptional()
  @IsInt()
  idEstado?: number;

  @IsOptional()
  @IsInt()
  idTerminal?: number;

  @IsOptional()
  @IsInt()
  idEstadoWeb?: number;

  @IsOptional()
  @IsBoolean()
  multa?: boolean;

  @IsOptional()
  @IsString()
  documentoEntidadPos?: string;

  @IsOptional()
  @IsBoolean()
  entidadModificada?: boolean;

  @IsOptional()
  @IsString()
  nombreCompletoEntidad?: string;

  @IsOptional()
  @IsString()
  documentoEntidadRegistro?: string;

  @IsOptional()
  @IsString()
  registroMedico?: string;

  @IsOptional()
  @IsString()
  firmaEntidad?: string;

  @IsOptional()
  @IsInt()
  idProCredito?: number;

  @IsOptional()
  @IsBoolean()
  aplicarOrden?: boolean;

  @IsOptional()
  @IsInt()
  idTipoTarifa?: number;

  @IsOptional()
  @IsBoolean()
  sincronizar?: boolean;
}
