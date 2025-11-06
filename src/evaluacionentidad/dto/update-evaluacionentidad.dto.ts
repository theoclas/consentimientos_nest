import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionentidadDto } from './create-evaluacionentidad.dto';

export class UpdateEvaluacionentidadDto extends PartialType(CreateEvaluacionentidadDto) {}
