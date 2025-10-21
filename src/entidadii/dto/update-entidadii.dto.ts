import { PartialType } from '@nestjs/mapped-types';
import { CreateEntidadIIDto } from './create-entidadii.dto';

export class UpdateEntidadIIDto extends PartialType(CreateEntidadIIDto) { }
