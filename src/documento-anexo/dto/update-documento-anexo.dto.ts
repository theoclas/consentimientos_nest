import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentoAnexoDto } from './create-documento-anexo.dto';

export class UpdateDocumentoAnexoDto extends PartialType(CreateDocumentoAnexoDto) {}
