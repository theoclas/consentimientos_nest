import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionFormulaDto } from './create-evaluacion-formula.dto';

export class UpdateEvaluacionFormulaDto extends PartialType(CreateEvaluacionFormulaDto) {}
