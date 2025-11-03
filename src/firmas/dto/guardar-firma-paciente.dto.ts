import { IsOptional, IsString } from 'class-validator';

export class GuardarFirmaPacienteDto {
  @IsString() // viene como "data:image/png;base64,AAAA..."
  imagenBase64!: string;

  @IsOptional()
  @IsString()
  pacienteNombre?: string;

  @IsOptional()
  @IsString()
  pacienteDoc?: string;
}