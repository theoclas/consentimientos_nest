import { PartialType } from '@nestjs/mapped-types';
import { CreateCnstaNestEntidadEvaluacionDto } from './create-cnsta-nest-entidad-evaluacion.dto';

export class UpdateCnstaNestEntidadEvaluacionDto extends PartialType(CreateCnstaNestEntidadEvaluacionDto) {}
