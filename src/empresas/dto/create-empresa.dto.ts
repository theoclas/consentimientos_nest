import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  documentoEmpresa: string;

  @IsOptional()
  @IsInt()
  idTipoDocumento?: number;

  @IsOptional()
  @IsInt()
  idCiudad?: number;

  @IsOptional()
  @IsString()
  nombreComercialEmpresa?: string;

  @IsOptional()
  @IsString()
  razonSocialEmpresa?: string;

  @IsOptional()
  @IsString()
  codigoEmpresa?: string;

  @IsOptional()
  @IsString()
  observacionesEmpresa?: string;
}
