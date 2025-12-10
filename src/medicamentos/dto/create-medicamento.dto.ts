import { IsOptional, IsString } from 'class-validator';

export class CreateMedicamentoDto {
    @IsOptional()
    @IsString()
    capitulo?: string;

    @IsOptional()
    @IsString()
    subcapitulo?: string;

    @IsOptional()
    @IsString()
    codigoObjeto?: string;

    @IsOptional()
    @IsString()
    descripcionObjeto?: string;
}

