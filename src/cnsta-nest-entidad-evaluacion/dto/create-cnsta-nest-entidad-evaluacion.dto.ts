 
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCnstaNestEntidadEvaluacionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ciudad?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sexo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estadoCivil?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ocupacion?: number;

  @IsOptional()
  @IsString()
  docAseguradora?: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsString()
  docUsuario?: string;
}
