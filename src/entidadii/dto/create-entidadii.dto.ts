import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateEntidadIIDto {
  @IsString()
  documentoEntidad: string;

  @IsOptional()
  @IsString()
  direccionEntidadII?: string;

  @IsOptional()
  @IsInt()
  idBarrio?: number;

  @IsOptional()
  @IsString()
  telefono1EntidadII?: string;

  @IsOptional()
  @IsString()
  telefono2EntidadII?: string;

  @IsOptional()
  @IsString()
  telefonoCelularEntidadII?: string;

  @IsOptional()
  @IsInt()
  idEmpresaCelular?: number;

  @IsOptional()
  @IsString()
  beeperEntidadII?: string;

  @IsOptional()
  @IsString()
  emailEntidadII?: string;

  @IsOptional()
  @IsInt()
  idZonaUbicacion?: number;

  @IsOptional()
  @IsInt()
  idCiudad?: number;
}
